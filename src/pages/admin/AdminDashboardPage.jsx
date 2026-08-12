import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../services/AuthContext';
import { 
  getAdminStatsService, 
  getAdminLeaderboardService, 
  getEventSettingsService, 
  updateEventStatusService, 
  resetRound1DataService, 
  supabase 
} from '../../services/supabase';
import { 
  Users, 
  Play, 
  CheckCircle2, 
  Clock, 
  Download, 
  RefreshCw, 
  LogOut, 
  Power, 
  RotateCcw, 
  Search, 
  Trophy, 
  Activity, 
  TrendingUp, 
  BarChart3, 
  Sparkles,
  CheckCircle
} from 'lucide-react';

const AdminDashboardPage = () => {
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'participants' | 'leaderboard' | 'analytics'
  const [stats, setStats] = useState({
    total: 65,
    active: 0,
    completed: 0,
    pending: 65,
    avgScore: 0,
    maxScore: 0
  });
  const [leaderboard, setLeaderboard] = useState([]);
  const [eventSettings, setEventSettings] = useState({
    status: 'SCHEDULED',
    started_at: null,
    closed_at: null,
  });
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'pending' | 'started' | 'submitted'
  const [sortBy, setSortBy] = useState('rank'); // 'rank' | 'score' | 'speed' | 'roll'

  const fetchDashboardData = async () => {
    setLoading(true);
    
    const statsRes = await getAdminStatsService();
    const leaderRes = await getAdminLeaderboardService();
    const settingsRes = await getEventSettingsService();

    if (settingsRes.data) setEventSettings(settingsRes.data);
    if (statsRes.data) setStats(statsRes.data);
    if (leaderRes.data) {
      const processed = leaderRes.data.map(p => {
        let durationMs = null;
        if (p.started_at && p.submitted_at) {
          durationMs = new Date(p.submitted_at).getTime() - new Date(p.started_at).getTime();
        } else if (p.started_at) {
          durationMs = new Date().getTime() - new Date(p.started_at).getTime();
        }

        return {
          ...p,
          durationMs,
        };
      });

      processed.sort((a, b) => {
        const scoreDiff = Number(b.final_score) - Number(a.final_score);
        if (Math.abs(scoreDiff) > 0.001) return scoreDiff;
        
        const timeA = a.durationMs || Infinity;
        const timeB = b.durationMs || Infinity;
        return timeA - timeB;
      });

      setLeaderboard(processed);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (newStatus) => {
    if (newStatus === 'CLOSED') {
      const confirmClose = window.confirm("Are you sure you want to CLOSE Round 1?\nParticipants will no longer be able to submit their posters.");
      if (!confirmClose) return;
    }

    setUpdatingStatus(true);
    try {
      const { data, error } = await updateEventStatusService(newStatus);
      setUpdatingStatus(false);

      if (error || (data && !data.success)) {
        const errMsg = error?.message || data?.error || 'Failed to update event status';
        alert(errMsg);
      } else {
        await fetchDashboardData();
      }
    } catch (err) {
      setUpdatingStatus(false);
      alert('Network error: Unable to reach Supabase. Please check your connection.');
    }
  };

  const handleResetData = async () => {
    const confirmReset = window.confirm(
      "Are you sure you want to RESET all Round 1 data?\n\nThis will:\n- Reset all participants to 'pending' (0 score)\n- Clear active session locks\n- Delete submissions & task results\n- Set Event Status to 'SCHEDULED'"
    );
    if (!confirmReset) return;

    setResetting(true);
    const { error } = await resetRound1DataService();
    setResetting(false);

    if (error) {
      alert('Failed to reset Round 1 data: ' + (error.message || 'Unknown error'));
    } else {
      await fetchDashboardData();
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const channel = supabase
      .channel('admin_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'participants' }, () => fetchDashboardData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'event_settings' }, () => fetchDashboardData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatDuration = (ms) => {
    if (ms === null || ms === undefined || ms === Infinity) return '--:--';
    const totalSecs = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSecs / 60);
    const seconds = totalSecs % 60;
    return `${minutes}m ${seconds}s`;
  };

  const handleExportCSV = () => {
    if (!leaderboard.length) return;

    const headers = ['Rank', 'Roll Number', 'Name', 'Score', 'Duration', 'Status', 'Selection'];
    const rows = leaderboard.map((p, idx) => [
      idx + 1,
      p.roll_number,
      p.name,
      Number(p.final_score).toFixed(2),
      formatDuration(p.durationMs),
      p.status,
      idx < 30 ? 'TOP 30 PASS' : 'NOT SELECTED'
    ]);

    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `round1_leaderboard_all.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeaderboard = useMemo(() => {
    return leaderboard.filter(p => {
      const matchesSearch = 
        p.roll_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      if (sortBy === 'roll') {
        return a.roll_number.localeCompare(b.roll_number);
      }
      if (sortBy === 'speed') {
        const timeA = a.durationMs || Infinity;
        const timeB = b.durationMs || Infinity;
        return timeA - timeB;
      }
      if (sortBy === 'score') {
        return Number(b.final_score) - Number(a.final_score);
      }
      return 0;
    });
  }, [leaderboard, searchQuery, statusFilter, sortBy]);

  const recentActivities = useMemo(() => {
    const list = leaderboard
      .filter(p => p.submitted_at || p.started_at)
      .map(p => {
        const timestamp = p.submitted_at || p.started_at;
        return {
          id: p.id,
          roll_number: p.roll_number,
          name: p.name,
          action: p.submitted_at ? 'Submitted Round 1' : 'Started Round 1',
          time: new Date(timestamp),
          score: p.final_score,
          isSubmission: !!p.submitted_at
        };
      });

    list.sort((a, b) => b.time.getTime() - a.time.getTime());
    return list.slice(0, 5);
  }, [leaderboard]);

  const completionPercentage = Math.round((stats.completed / (stats.total || 1)) * 100);
  const activePercentage = Math.round((stats.active / (stats.total || 1)) * 100);
  const pendingPercentage = Math.round((stats.pending / (stats.total || 1)) * 100);

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#111827] font-sans selection:bg-[#2563EB] selection:text-white flex flex-col justify-between">
      
      {/* 1. TOP WHITE NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB] px-6 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand & Navigation */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#2563EB] rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-[#2563EB]/20">
                <Sparkles size={18} />
              </div>
              <div>
                <span className="text-sm font-black text-[#111827] tracking-tight flex items-center gap-1.5 uppercase">
                  DESIGN-EVENT
                </span>
                <span className="text-[11px] text-[#6B7280] block font-semibold">Competition Admin Operations</span>
              </div>
            </div>

            {/* Nav Tabs */}
            <div className="hidden lg:flex items-center gap-1 bg-[#F8FAFF] p-1 rounded-xl border border-[#E5E7EB]">
              {[
                { id: 'overview', label: 'Dashboard' },
                { id: 'participants', label: `Participants (${stats.total})` },
                { id: 'leaderboard', label: 'Leaderboard' },
                { id: 'analytics', label: 'Analytics' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#2563EB] text-white shadow-sm'
                      : 'text-[#6B7280] hover:text-[#111827] hover:bg-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Controls & Admin Profile */}
          <div className="flex items-center gap-3">
            {/* Live Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F8FAFF] border border-[#E5E7EB] text-xs">
              <span className={`w-2 h-2 rounded-full ${
                eventSettings?.status === 'LIVE' 
                  ? 'bg-[#16A34A] animate-pulse' 
                  : eventSettings?.status === 'CLOSED'
                  ? 'bg-red-500'
                  : 'bg-amber-500'
              }`} />
              <span className="text-[#111827] font-bold">{eventSettings?.status || 'SCHEDULED'}</span>
            </div>

            <button
              onClick={fetchDashboardData}
              className="p-2 bg-white border border-[#E5E7EB] hover:bg-[#F8FAFF] rounded-xl text-[#6B7280] hover:text-[#111827] transition cursor-pointer shadow-sm"
              title="Refresh Data"
            >
              <RefreshCw size={15} className={loading ? "animate-spin text-[#2563EB]" : ""} />
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-[#E5E7EB]">
              <div className="w-8 h-8 rounded-full bg-[#EFF6FF] border border-[#2563EB]/20 flex items-center justify-center text-xs font-bold text-[#2563EB]">
                AD
              </div>
              <button
                onClick={logout}
                className="p-2 text-[#6B7280] hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                title="Logout Admin"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 space-y-8 flex-grow">
        
        {/* 2. PAGE HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#111827] tracking-tight">
              Competition Overview
            </h1>
            <p className="text-xs md:text-sm text-[#6B7280] mt-1 font-semibold">
              Real-time monitoring and control for Poster Design Round 1 (3rd Year Pool: 65)
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleResetData}
              disabled={resetting}
              className="flex items-center gap-2 px-3.5 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-bold text-red-700 rounded-xl transition cursor-pointer disabled:opacity-50"
            >
              <RotateCcw size={14} className={resetting ? "animate-spin" : ""} />
              {resetting ? "Resetting..." : "Reset Round 1 Data"}
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-bold text-white rounded-xl shadow-md shadow-[#2563EB]/20 transition cursor-pointer"
            >
              <Download size={14} />
              Export CSV
            </button>
          </div>
        </div>

        {/* 3. EVENT CONTROL BANNER CARD */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold text-[#111827] tracking-tight">POSTER DESIGN — ROUND 1</h2>
              
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/20">
                3rd Year Only
              </span>

              <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                eventSettings?.status === 'LIVE'
                  ? 'bg-emerald-50 text-[#16A34A] border border-emerald-200 animate-pulse'
                  : eventSettings?.status === 'CLOSED'
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-amber-50 text-amber-600 border border-amber-200'
              }`}>
                ● {eventSettings?.status || 'SCHEDULED'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-[#6B7280] font-semibold">
              <span>Registered: <strong className="text-[#111827]">{stats.total}</strong></span>
              <span>Active: <strong className="text-amber-600">{stats.active}</strong></span>
              <span>Completed: <strong className="text-[#16A34A]">{stats.completed}</strong></span>
              <span>Waiting: <strong className="text-[#6B7280]">{stats.pending}</strong></span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#9CA3AF] pt-1 font-mono">
              <span>Started At: {eventSettings?.started_at ? new Date(eventSettings.started_at).toLocaleTimeString() : 'Not Started'}</span>
              <span>Closed At: {eventSettings?.closed_at ? new Date(eventSettings.closed_at).toLocaleTimeString() : '--:--'}</span>
            </div>
          </div>

          {/* Event Action Button */}
          <div className="shrink-0">
            {eventSettings?.status === 'SCHEDULED' && (
              <button
                onClick={() => handleUpdateStatus('LIVE')}
                disabled={updatingStatus}
                className="px-6 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-bold text-white rounded-xl shadow-lg shadow-[#2563EB]/20 transition cursor-pointer disabled:opacity-50 flex items-center gap-2.5 tracking-wider uppercase"
              >
                <Power size={16} />
                {updatingStatus ? 'Starting Round 1...' : 'START ROUND 1'}
              </button>
            )}

            {eventSettings?.status === 'LIVE' && (
              <button
                onClick={() => handleUpdateStatus('CLOSED')}
                disabled={updatingStatus}
                className="px-6 py-3.5 bg-[#DC2626] hover:bg-red-700 text-xs font-bold text-white rounded-xl shadow-lg shadow-red-600/20 transition cursor-pointer disabled:opacity-50 flex items-center gap-2.5 tracking-wider uppercase"
              >
                <Power size={16} />
                {updatingStatus ? 'Closing Round 1...' : 'CLOSE ROUND 1'}
              </button>
            )}

            {eventSettings?.status === 'CLOSED' && (
              <button
                onClick={() => handleUpdateStatus('LIVE')}
                disabled={updatingStatus}
                className="px-6 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-bold text-white rounded-xl shadow-lg shadow-[#2563EB]/20 transition cursor-pointer disabled:opacity-50 flex items-center gap-2.5 tracking-wider uppercase"
              >
                <RotateCcw size={16} />
                {updatingStatus ? 'Re-opening...' : 'RE-OPEN ROUND 1'}
              </button>
            )}
          </div>
        </div>

        {/* 4. KPI CARDS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* 1. Total Pool */}
          <div className="bg-white border border-[#E5E7EB] p-5 rounded-2xl shadow-sm hover:border-[#2563EB]/40 transition">
            <div className="flex items-center justify-between text-[#6B7280] mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Total Pool</span>
              <div className="p-2 rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                <Users size={16} />
              </div>
            </div>
            <div className="text-2xl font-black text-[#111827]">{stats.total}</div>
            <p className="text-[11px] text-[#6B7280] font-medium mt-1">Registered participants</p>
          </div>

          {/* 2. Active */}
          <div className="bg-white border border-[#E5E7EB] p-5 rounded-2xl shadow-sm hover:border-amber-400 transition">
            <div className="flex items-center justify-between text-[#6B7280] mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Active</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Activity size={16} />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-600">{stats.active}</div>
            <p className="text-[11px] text-[#6B7280] font-medium mt-1">Currently attempting</p>
          </div>

          {/* 3. Completed */}
          <div className="bg-white border border-[#E5E7EB] p-5 rounded-2xl shadow-sm hover:border-emerald-400 transition">
            <div className="flex items-center justify-between text-[#6B7280] mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
              <div className="p-2 rounded-xl bg-emerald-50 text-[#16A34A]">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <div className="text-2xl font-black text-[#16A34A]">{stats.completed}</div>
            <p className="text-[11px] text-[#6B7280] font-medium mt-1">Submissions received</p>
          </div>

          {/* 4. Not Started */}
          <div className="bg-white border border-[#E5E7EB] p-5 rounded-2xl shadow-sm hover:border-gray-400 transition">
            <div className="flex items-center justify-between text-[#6B7280] mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Not Started</span>
              <div className="p-2 rounded-xl bg-gray-100 text-gray-600">
                <Clock size={16} />
              </div>
            </div>
            <div className="text-2xl font-black text-[#374151]">{stats.pending}</div>
            <p className="text-[11px] text-[#6B7280] font-medium mt-1">Waiting to begin</p>
          </div>

          {/* 5. Average Score */}
          <div className="bg-white border border-[#E5E7EB] p-5 rounded-2xl shadow-sm hover:border-purple-400 transition">
            <div className="flex items-center justify-between text-[#6B7280] mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Avg Score</span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <TrendingUp size={16} />
              </div>
            </div>
            <div className="text-2xl font-black text-purple-700">
              {Number(stats.avgScore || 0).toFixed(1)} <span className="text-xs text-[#6B7280] font-normal">/100</span>
            </div>
            <p className="text-[11px] text-[#6B7280] font-medium mt-1">Across completed</p>
          </div>

          {/* 6. Top Score */}
          <div className="bg-white border border-[#E5E7EB] p-5 rounded-2xl shadow-sm hover:border-amber-400 transition">
            <div className="flex items-center justify-between text-[#6B7280] mb-3">
              <span className="text-xs font-bold uppercase tracking-wider">Top Score</span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Trophy size={16} />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-600">
              {Number(stats.maxScore || 0).toFixed(1)} <span className="text-xs text-[#6B7280] font-normal">/100</span>
            </div>
            <p className="text-[11px] text-[#6B7280] font-medium mt-1">Leading submission</p>
          </div>

        </div>

        {/* 5. VISUALIZATIONS & LIVE ACTIVITY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Progress & Distribution */}
          <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
              <div>
                <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
                  <BarChart3 size={18} className="text-[#2563EB]" />
                  Participant Progress & Completion Distribution
                </h3>
                <p className="text-xs text-[#6B7280] mt-0.5">Real-time status breakdown across 65 registered participants</p>
              </div>
              <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-3 py-1 rounded-xl border border-[#2563EB]/20">
                {completionPercentage}% Complete
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#374151]">
                <span>Completion Status</span>
                <span>{stats.completed} of 65 Submitted</span>
              </div>
              <div className="w-full h-3 bg-[#F1F5F9] rounded-full overflow-hidden flex p-0.5 border border-[#E5E7EB]">
                <div 
                  style={{ width: `${completionPercentage}%` }} 
                  className="bg-[#16A34A] h-full rounded-full transition-all duration-500" 
                  title={`Completed: ${stats.completed}`}
                />
                <div 
                  style={{ width: `${activePercentage}%` }} 
                  className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                  title={`Active: ${stats.active}`}
                />
                <div 
                  style={{ width: `${pendingPercentage}%` }} 
                  className="bg-gray-300 h-full rounded-full transition-all duration-500" 
                  title={`Not Started: ${stats.pending}`}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                  <span className="text-[#374151] font-semibold">Completed ({stats.completed})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-[#374151] font-semibold">Active ({stats.active})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                  <span className="text-[#6B7280] font-semibold">Not Started ({stats.pending})</span>
                </div>
              </div>
            </div>

            {/* Blue Score Spectrum Chart */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-[#6B7280] mb-3 uppercase tracking-wider">Score Breakdown Spectrum</h4>
              <div className="h-28 bg-[#F8FAFF] rounded-xl border border-[#E5E7EB] p-4 flex items-end justify-between gap-2">
                {leaderboard.length === 0 || stats.completed === 0 ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#6B7280] text-xs font-semibold">
                    <Clock size={20} className="mb-1 text-[#9CA3AF]" />
                    <span>No submissions evaluated yet. Spectrum will render live on submission.</span>
                  </div>
                ) : (
                  leaderboard.slice(0, 15).map((p, idx) => {
                    const heightPercent = Math.max(10, Math.min(100, (Number(p.final_score) / 100) * 100));
                    return (
                      <div key={p.id || idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                        <div className="absolute -top-8 bg-[#111827] text-white text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-50">
                          {p.roll_number}: {Number(p.final_score).toFixed(1)} pts
                        </div>
                        <div 
                          style={{ height: `${heightPercent}%` }}
                          className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] rounded-t transition"
                        />
                        <span className="text-[9px] text-[#6B7280] font-mono hidden sm:inline font-bold">{p.roll_number.slice(-3)}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* 6. LIVE EVENT ACTIVITY FEED */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
                <h3 className="text-base font-bold text-[#111827] flex items-center gap-2">
                  <Activity size={18} className="text-[#2563EB]" />
                  Live Event Activity
                </h3>
                <span className="text-[11px] font-bold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase">
                  Realtime
                </span>
              </div>

              {recentActivities.length === 0 ? (
                <div className="py-12 text-center text-[#6B7280] space-y-2">
                  <Clock size={28} className="mx-auto text-[#94A3B8]" />
                  <p className="text-xs font-bold text-[#111827]">Waiting for event activity...</p>
                  <p className="text-[11px] text-[#6B7280]">
                    Activities will appear live here as participants log in, start tasks, and submit posters.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivities.map((act) => (
                    <div key={act.id} className="p-3 bg-[#F8FAFF] rounded-xl border border-[#E5E7EB] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          act.isSubmission
                            ? 'bg-emerald-50 text-[#16A34A] border border-emerald-200'
                            : 'bg-amber-50 text-amber-600 border border-amber-200'
                        }`}>
                          {act.roll_number.slice(-3)}
                        </div>
                        <div>
                          <div className="font-bold text-[#111827]">{act.roll_number}</div>
                          <div className="text-[11px] text-[#6B7280] font-medium">{act.action}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        {act.isSubmission && (
                          <span className="font-extrabold text-[#2563EB] block">
                            {Number(act.score).toFixed(1)} <span className="text-[10px] text-[#6B7280] font-normal">pts</span>
                          </span>
                        )}
                        <span className="text-[10px] text-[#6B7280] font-mono font-semibold">
                          {act.time.toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] text-[11px] text-[#6B7280] flex items-center justify-between font-semibold">
              <span>Auto-syncing via Supabase Realtime</span>
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
            </div>
          </div>

        </div>

        {/* 7. LEADERBOARD TABLE */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden space-y-4 p-6">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                <Trophy size={18} className="text-amber-500" />
                Evaluation Leaderboard & Participant Roster
              </h3>
              <p className="text-xs text-[#6B7280] mt-0.5">Top 30 participants pass to Round 2</p>
            </div>

            {/* Search + Filter Controls */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              
              <div className="relative flex-1 md:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="text"
                  placeholder="Search by roll or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F8FAFF] border border-[#E5E7EB] rounded-xl pl-9 pr-3 py-2 text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#2563EB] transition font-medium"
                />
              </div>

              <div className="flex items-center bg-[#F8FAFF] p-1 rounded-xl border border-[#E5E7EB] text-xs">
                {['ALL', 'pending', 'started', 'submitted'].map(f => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] uppercase transition cursor-pointer ${
                      statusFilter === f
                        ? 'bg-[#2563EB] text-white shadow-sm'
                        : 'text-[#6B7280] hover:text-[#111827]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#F8FAFF] border border-[#E5E7EB] rounded-xl px-3 py-2 text-xs text-[#111827] focus:outline-none cursor-pointer font-bold"
              >
                <option value="rank">Sort by Rank</option>
                <option value="score">Sort by Score</option>
                <option value="speed">Sort by Speed</option>
                <option value="roll">Sort by Roll No</option>
              </select>
            </div>
          </div>

          {/* White Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#374151]">
              <thead className="bg-[#F8FAFF] text-[#6B7280] uppercase font-bold text-[11px] tracking-wider border-b border-[#E5E7EB]">
                <tr>
                  <th className="py-3.5 px-4 text-center w-16">Rank</th>
                  <th className="py-3.5 px-4">Roll Number</th>
                  <th className="py-3.5 px-4">Participant Name</th>
                  <th className="py-3.5 px-4 text-right">Score (/100)</th>
                  <th className="py-3.5 px-4 text-center">Duration</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Selection Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredLeaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#6B7280] space-y-2">
                      <Clock size={28} className="mx-auto text-[#94A3B8]" />
                      <p className="text-sm font-bold text-[#111827]">No participant records found</p>
                      <p className="text-xs text-[#6B7280]">
                        {searchQuery ? "Try resetting your search query" : "65 participants waiting for Round 1 to begin"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredLeaderboard.map((p, index) => {
                    const actualRank = index + 1;
                    const isTop30 = actualRank <= 30 && p.status === 'submitted';
                    
                    return (
                      <tr 
                        key={p.id || p.roll_number}
                        className="hover:bg-[#F8FAFF] transition group"
                      >
                        {/* Rank */}
                        <td className="py-3.5 px-4 text-center font-bold">
                          {actualRank === 1 ? (
                            <span className="w-7 h-7 rounded-full bg-[#2563EB] text-white inline-flex items-center justify-center font-extrabold text-xs shadow-md shadow-[#2563EB]/20">
                              1
                            </span>
                          ) : actualRank === 2 ? (
                            <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 border border-slate-300 inline-flex items-center justify-center font-extrabold text-xs">
                              2
                            </span>
                          ) : actualRank === 3 ? (
                            <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 border border-amber-300 inline-flex items-center justify-center font-extrabold text-xs">
                              3
                            </span>
                          ) : (
                            <span className="text-[#6B7280] font-mono text-xs">{actualRank}</span>
                          )}
                        </td>

                        {/* Roll Number */}
                        <td className="py-3.5 px-4 font-mono font-bold text-[#111827] flex items-center gap-2">
                          <span className="w-6 h-6 rounded bg-[#EFF6FF] flex items-center justify-center text-[10px] text-[#2563EB] font-mono font-bold border border-[#2563EB]/20">
                            {p.roll_number.slice(-3)}
                          </span>
                          {p.roll_number}
                        </td>

                        {/* Participant Name */}
                        <td className="py-3.5 px-4 font-semibold text-[#111827]">
                          {p.name}
                        </td>

                        {/* Score */}
                        <td className="py-3.5 px-4 text-right font-bold">
                          <span className={p.final_score > 0 ? "text-[#2563EB] font-black text-sm" : "text-[#9CA3AF]"}>
                            {Number(p.final_score || 0).toFixed(1)}
                          </span>
                        </td>

                        {/* Duration */}
                        <td className="py-3.5 px-4 text-center font-mono text-[#6B7280] font-medium">
                          {formatDuration(p.durationMs)}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            p.status === 'submitted'
                              ? 'bg-emerald-50 text-[#16A34A] border border-emerald-200'
                              : p.status === 'started'
                              ? 'bg-amber-50 text-amber-600 border border-amber-200'
                              : 'bg-gray-100 text-gray-500 border border-gray-200'
                          }`}>
                            {p.status}
                          </span>
                        </td>

                        {/* Selection Badge */}
                        <td className="py-3.5 px-4 text-center">
                          {p.status === 'submitted' ? (
                            isTop30 ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/30 inline-flex items-center gap-1">
                                <CheckCircle size={10} /> TOP 30 PASS
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-600 border border-red-200">
                                NOT SELECTED
                              </span>
                            )
                          ) : (
                            <span className="text-[#9CA3AF] text-[11px]">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer Summary */}
          <div className="flex items-center justify-between text-xs text-[#6B7280] pt-2 border-t border-[#E5E7EB] font-semibold">
            <span>Showing {filteredLeaderboard.length} of {leaderboard.length} participants</span>
            <span>Target Selection: Top 30 Progress to Round 2</span>
          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#E5E7EB] py-4 px-6 text-center text-xs text-[#6B7280] bg-white font-medium">
        © 2026 Poster Competition Admin Operations Console • 3rd Year Only • 65 Participants Pool
      </footer>

    </div>
  );
};

export default AdminDashboardPage;
