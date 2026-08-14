import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../services/AuthContext';
import { 
  getAdminStatsService, 
  getAdminLeaderboardService, 
  getEventSettingsService, 
  updateEventStatusService, 
  resetRound1DataService, 
  addParticipantService,
  clearAllParticipantsService,
  supabase 
} from '../../services/supabase';
import { 
  Users, 
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
  UserPlus,
  X,
  AlertCircle,
  Trash2
} from 'lucide-react';

const AdminDashboardPage = () => {
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'participants' | 'leaderboard' | 'analytics'
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    pending: 0,
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
  const [clearing, setClearing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'pending' | 'started' | 'submitted'
  const [sortBy, setSortBy] = useState('order'); // 'order' | 'rank' | 'score' | 'speed' | 'roll'

  // Add Participant Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    rollNumber: '',
    name: '',
    year: 2
  });
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');
  const [isSubmittingParticipant, setIsSubmittingParticipant] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    const statsRes = await getAdminStatsService();
    const leaderRes = await getAdminLeaderboardService();
    const settingsRes = await getEventSettingsService();

    if (settingsRes.data) setEventSettings(settingsRes.data);
    if (statsRes.data) setStats(statsRes.data);
    if (leaderRes.data) {
      const processed = leaderRes.data.map((p, idx) => {
        let durationMs = null;
        if (p.started_at && p.submitted_at) {
          durationMs = new Date(p.submitted_at).getTime() - new Date(p.started_at).getTime();
        } else if (p.started_at) {
          durationMs = new Date().getTime() - new Date(p.started_at).getTime();
        }

        return {
          ...p,
          regIndex: idx + 1,
          durationMs,
        };
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

  const handleClearAllParticipants = async () => {
    const confirmClear = window.confirm(
      "DANGER: Are you sure you want to PURGE & DELETE ALL participants from the database?\n\nThis will remove all pre-seeded (274001-274065) and registered student records!"
    );
    if (!confirmClear) return;

    setClearing(true);
    const { error } = await clearAllParticipantsService();
    setClearing(false);

    if (error) {
      alert('Failed to clear participants: ' + (error.message || 'Unknown error'));
    } else {
      await fetchDashboardData();
      alert('All participant records cleared successfully!');
    }
  };

  const handleAddParticipantSubmit = async (e) => {
    e.preventDefault();
    setAddError('');
    setAddSuccess('');

    if (!addForm.rollNumber.trim()) {
      setAddError('Batch Number / Register Number is required.');
      return;
    }
    if (!addForm.name.trim()) {
      setAddError('Full Name is required.');
      return;
    }

    setIsSubmittingParticipant(true);
    const { data, error } = await addParticipantService(addForm);
    setIsSubmittingParticipant(false);

    if (error) {
      setAddError(error.message || 'Failed to register participant.');
    } else {
      const addedRoll = data?.roll_number || addForm.rollNumber.trim().toUpperCase();
      const addedName = data?.name || addForm.name.trim();
      setAddSuccess(`Participant ${addedName} (${addedRoll}) registered successfully!`);
      setAddForm({ rollNumber: '', name: '', year: 2 });
      await fetchDashboardData();
      setTimeout(() => {
        setShowAddModal(false);
        setAddSuccess('');
      }, 1200);
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

    const headers = ['Order', 'Register Number', 'Name', 'Year', 'Speed / Time Taken', 'Score', 'Status', 'Selection'];
    const rows = leaderboard.map((p, idx) => [
      p.regIndex || idx + 1,
      p.roll_number,
      p.name,
      p.year ? `${p.year}nd/rd Year` : '2nd Year',
      formatDuration(p.durationMs),
      Number(p.final_score).toFixed(2),
      p.status,
      idx < 30 ? 'TOP 30 PASS' : 'NOT SELECTED'
    ]);

    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `round1_participants_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeaderboard = useMemo(() => {
    return leaderboard.filter(p => {
      const matchesSearch = 
        p.roll_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.department && p.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.email && p.email.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      if (sortBy === 'order') {
        const orderA = a.created_at ? new Date(a.created_at).getTime() : a.regIndex;
        const orderB = b.created_at ? new Date(b.created_at).getTime() : b.regIndex;
        return orderA - orderB;
      }
      if (sortBy === 'roll') {
        return a.roll_number.localeCompare(b.roll_number);
      }
      if (sortBy === 'speed') {
        const timeA = a.durationMs || Infinity;
        const timeB = b.durationMs || Infinity;
        return timeA - timeB;
      }
      if (sortBy === 'score' || sortBy === 'rank') {
        const scoreDiff = Number(b.final_score) - Number(a.final_score);
        if (Math.abs(scoreDiff) > 0.001) return scoreDiff;
        const timeA = a.durationMs || Infinity;
        const timeB = b.durationMs || Infinity;
        return timeA - timeB;
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
    <div className="font-comic-body min-h-screen bg-[#F3EEE7] text-[#111111] selection:bg-[#E11D2E] selection:text-white flex flex-col justify-between">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700&display=swap');
        .font-comic-body { font-family: 'Comic Neue', 'Comic Sans MS', cursive, sans-serif; }
        .font-display { font-family: 'Bangers', 'Archivo Black', cursive; letter-spacing: 0.03em; }
      `}</style>

      {/* 1. TOP NAVIGATION BAR */}
      <nav className="sticky top-0 z-40 bg-white border-b-4 border-[#111111] px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand & Navigation */}
          <div className="flex items-center gap-6">
            <div>
              <span className="font-display text-lg tracking-wide text-[#E11D2E] block">
                DESIGN-EVENT<span className="text-[#111111]">.</span>
              </span>
              <span className="text-[11px] text-[#6B7280] block font-bold">Competition Admin Operations</span>
            </div>

            {/* Nav Tabs */}
            <div className="hidden lg:flex items-center gap-1 bg-[#F3EEE7] p-1 rounded-full border-2 border-[#111111]">
              {[
                { id: 'overview', label: 'Dashboard' },
                { id: 'participants', label: `Participants (${stats.total})` },
                { id: 'leaderboard', label: 'Leaderboard' },
                { id: 'analytics', label: 'Analytics' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#111111] text-white'
                      : 'text-[#6B7280] hover:text-[#111827]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Controls & Admin Profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setAddError('');
                setAddSuccess('');
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-[#E11D2E] hover:bg-[#c8121f] text-xs font-extrabold text-white rounded-full border-2 border-[#111111] transition cursor-pointer"
            >
              <UserPlus size={14} />
              <span className="hidden sm:inline">Add Participant</span>
            </button>

            {/* Live Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F3EEE7] border-2 border-[#111111] text-xs">
              <span className={`w-2 h-2 rounded-full ${
                eventSettings?.status === 'LIVE' 
                  ? 'bg-[#16A34A] animate-pulse' 
                  : eventSettings?.status === 'CLOSED'
                  ? 'bg-red-500'
                  : 'bg-amber-500'
              }`} />
              <span className="text-[#111827] font-extrabold">{eventSettings?.status || 'SCHEDULED'}</span>
            </div>

            <button
              onClick={fetchDashboardData}
              className="p-2 bg-white border-2 border-[#111111] hover:bg-[#F3EEE7] rounded-full text-[#6B7280] hover:text-[#111827] transition cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw size={15} className={loading ? "animate-spin text-[#E11D2E]" : ""} />
            </button>

            <div className="flex items-center gap-2 pl-2 border-l-2 border-[#111111]/15">
              <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-xs font-extrabold text-[#FFC700]">
                AD
              </div>
              <button
                onClick={logout}
                className="p-2 text-[#6B7280] hover:text-[#E11D2E] hover:bg-[#F3EEE7] rounded-full transition cursor-pointer"
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
            <h1 className="font-display text-3xl md:text-4xl text-[#111111] tracking-wide">
              COMPETITION OVERVIEW
            </h1>
            <p className="text-sm text-[#6B7280] mt-1 font-semibold">
              Real-time monitoring and control for Poster Design Round 1 (2nd & 3rd Year • {stats.total} Participants)
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setAddError('');
                setAddSuccess('');
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#E11D2E] hover:bg-[#c8121f] text-xs font-extrabold text-white rounded-full border-2 border-[#111111] transition cursor-pointer"
            >
              <UserPlus size={14} />
              Add Participant
            </button>

            <button
              onClick={handleResetData}
              disabled={resetting}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#FFC700] hover:bg-[#e6b400] border-2 border-[#111111] text-xs font-extrabold text-[#111111] rounded-full transition cursor-pointer disabled:opacity-50"
              title="Reset scores and timers for existing participants"
            >
              <RotateCcw size={14} className={resetting ? "animate-spin" : ""} />
              {resetting ? "Resetting..." : "Reset Round 1 Data"}
            </button>

            <button
              onClick={handleClearAllParticipants}
              disabled={clearing}
              className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-red-50 border-2 border-[#E11D2E] text-xs font-extrabold text-[#E11D2E] rounded-full transition cursor-pointer disabled:opacity-50"
              title="Delete all participant records from database"
            >
              <Trash2 size={14} className={clearing ? "animate-spin" : ""} />
              {clearing ? "Clearing..." : "Clear All Participants"}
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#F3EEE7] border-2 border-[#111111] text-xs font-extrabold text-[#111111] rounded-full transition cursor-pointer"
            >
              <Download size={14} />
              Export CSV
            </button>
          </div>
        </div>

        {/* 3. EVENT CONTROL BANNER CARD */}
        <div className="bg-white border-2 border-[#111111] rounded-2xl p-6 shadow-[4px_4px_0px_0px_#111111] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-xl text-[#111111] tracking-wide">POSTER DESIGN — ROUND 1</h2>
              
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#F3EEE7] text-[#111111] border-2 border-[#111111]">
                2nd & 3rd Year
              </span>

              <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border-2 border-[#111111] ${
                eventSettings?.status === 'LIVE'
                  ? 'bg-emerald-50 text-[#16A34A] animate-pulse'
                  : eventSettings?.status === 'CLOSED'
                  ? 'bg-red-50 text-red-600'
                  : 'bg-amber-50 text-amber-600'
              }`}>
                ● {eventSettings?.status || 'SCHEDULED'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-[#6B7280] font-bold">
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
                className="px-6 py-3.5 bg-[#111111] hover:bg-[#E11D2E] text-xs font-extrabold text-white rounded-full border-2 border-[#111111] shadow-[3px_3px_0px_0px_#E11D2E] hover:shadow-[1px_1px_0px_0px_#111111] transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2.5 tracking-wider uppercase active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                <Power size={16} />
                {updatingStatus ? 'Starting Round 1...' : 'START ROUND 1'}
              </button>
            )}

            {eventSettings?.status === 'LIVE' && (
              <button
                onClick={() => handleUpdateStatus('CLOSED')}
                disabled={updatingStatus}
                className="px-6 py-3.5 bg-[#E11D2E] hover:bg-[#c8121f] text-xs font-extrabold text-white rounded-full border-2 border-[#111111] shadow-[3px_3px_0px_0px_#111111] hover:shadow-[1px_1px_0px_0px_#111111] transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2.5 tracking-wider uppercase active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                <Power size={16} />
                {updatingStatus ? 'Closing Round 1...' : 'CLOSE ROUND 1'}
              </button>
            )}

            {eventSettings?.status === 'CLOSED' && (
              <button
                onClick={() => handleUpdateStatus('LIVE')}
                disabled={updatingStatus}
                className="px-6 py-3.5 bg-[#111111] hover:bg-[#E11D2E] text-xs font-extrabold text-white rounded-full border-2 border-[#111111] shadow-[3px_3px_0px_0px_#FFC700] hover:shadow-[1px_1px_0px_0px_#111111] transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2.5 tracking-wider uppercase active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
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
          <div className="bg-white border-2 border-[#111111] p-5 rounded-2xl shadow-[3px_3px_0px_0px_#111111] transition">
            <div className="flex items-center justify-between text-[#6B7280] mb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Total Registered</span>
              <div className="p-2 rounded-full bg-[#F3EEE7] border-2 border-[#111111] text-[#111111]">
                <Users size={16} />
              </div>
            </div>
            <div className="font-display text-2xl text-[#111827]">{stats.total}</div>
            <p className="text-[11px] text-[#6B7280] font-medium mt-1">Total participants</p>
          </div>

          {/* 2. Active */}
          <div className="bg-white border-2 border-[#111111] p-5 rounded-2xl shadow-[3px_3px_0px_0px_#111111] transition">
            <div className="flex items-center justify-between text-[#6B7280] mb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Active</span>
              <div className="p-2 rounded-full bg-amber-50 border-2 border-[#111111] text-amber-600">
                <Activity size={16} />
              </div>
            </div>
            <div className="font-display text-2xl text-amber-600">{stats.active}</div>
            <p className="text-[11px] text-[#6B7280] font-medium mt-1">Currently attempting</p>
          </div>

          {/* 3. Completed */}
          <div className="bg-white border-2 border-[#111111] p-5 rounded-2xl shadow-[3px_3px_0px_0px_#111111] transition">
            <div className="flex items-center justify-between text-[#6B7280] mb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Completed</span>
              <div className="p-2 rounded-full bg-emerald-50 border-2 border-[#111111] text-[#16A34A]">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <div className="font-display text-2xl text-[#16A34A]">{stats.completed}</div>
            <p className="text-[11px] text-[#6B7280] font-medium mt-1">Submissions received</p>
          </div>

          {/* 4. Not Started */}
          <div className="bg-white border-2 border-[#111111] p-5 rounded-2xl shadow-[3px_3px_0px_0px_#111111] transition">
            <div className="flex items-center justify-between text-[#6B7280] mb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Not Started</span>
              <div className="p-2 rounded-full bg-gray-100 border-2 border-[#111111] text-gray-600">
                <Clock size={16} />
              </div>
            </div>
            <div className="font-display text-2xl text-[#374151]">{stats.pending}</div>
            <p className="text-[11px] text-[#6B7280] font-medium mt-1">Waiting to begin</p>
          </div>

          {/* 5. Average Score */}
          <div className="bg-white border-2 border-[#111111] p-5 rounded-2xl shadow-[3px_3px_0px_0px_#111111] transition">
            <div className="flex items-center justify-between text-[#6B7280] mb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Avg Score</span>
              <div className="p-2 rounded-full bg-purple-50 border-2 border-[#111111] text-purple-600">
                <TrendingUp size={16} />
              </div>
            </div>
            <div className="font-display text-2xl text-purple-700">
              {Number(stats.avgScore || 0).toFixed(1)} <span className="text-xs text-[#6B7280] font-normal font-comic-body">/100</span>
            </div>
            <p className="text-[11px] text-[#6B7280] font-medium mt-1">Across completed</p>
          </div>

          {/* 6. Top Score */}
          <div className="bg-white border-2 border-[#111111] p-5 rounded-2xl shadow-[3px_3px_0px_0px_#111111] transition">
            <div className="flex items-center justify-between text-[#6B7280] mb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider">Top Score</span>
              <div className="p-2 rounded-full bg-amber-50 border-2 border-[#111111] text-amber-600">
                <Trophy size={16} />
              </div>
            </div>
            <div className="font-display text-2xl text-amber-600">
              {Number(stats.maxScore || 0).toFixed(1)} <span className="text-xs text-[#6B7280] font-normal font-comic-body">/100</span>
            </div>
            <p className="text-[11px] text-[#6B7280] font-medium mt-1">Leading submission</p>
          </div>

        </div>

        {/* 5. VISUALIZATIONS & LIVE ACTIVITY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Progress & Distribution */}
          <div className="lg:col-span-2 bg-white border-2 border-[#111111] rounded-2xl p-6 shadow-[4px_4px_0px_0px_#111111] space-y-6">
            <div className="flex items-center justify-between border-b-2 border-dashed border-[#111111]/20 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-[#111827] flex items-center gap-2">
                  <BarChart3 size={18} className="text-[#E11D2E]" />
                  Participant Progress & Completion Distribution
                </h3>
                <p className="text-xs text-[#6B7280] mt-0.5 font-semibold">Real-time status breakdown across {stats.total} registered participants</p>
              </div>
              <span className="text-xs font-extrabold text-[#111111] bg-[#FFC700] px-3 py-1 rounded-full border-2 border-[#111111]">
                {completionPercentage}% Complete
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-extrabold text-[#374151]">
                <span>Completion Status</span>
                <span>{stats.completed} of {stats.total} Submitted</span>
              </div>
              <div className="w-full h-3.5 bg-[#F1F5F9] rounded-full overflow-hidden flex p-0.5 border-2 border-[#111111]">
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
                  <span className="text-[#374151] font-bold">Completed ({stats.completed})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-[#374151] font-bold">Active ({stats.active})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                  <span className="text-[#6B7280] font-bold">Not Started ({stats.pending})</span>
                </div>
              </div>
            </div>

            {/* Score Spectrum Chart */}
            <div className="pt-2">
              <h4 className="text-xs font-extrabold text-[#6B7280] mb-3 uppercase tracking-wider">Score Breakdown Spectrum</h4>
              <div className="h-28 bg-[#F3EEE7] rounded-xl border-2 border-[#111111] p-4 flex items-end justify-between gap-2">
                {leaderboard.length === 0 || stats.completed === 0 ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#6B7280] text-xs font-bold">
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
                          className="w-full bg-[#E11D2E] hover:bg-[#c8121f] rounded-t border-2 border-b-0 border-[#111111] transition"
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
          <div className="bg-white border-2 border-[#111111] rounded-2xl p-6 shadow-[4px_4px_0px_0px_#111111] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-dashed border-[#111111]/20 pb-4">
                <h3 className="text-base font-extrabold text-[#111827] flex items-center gap-2">
                  <Activity size={18} className="text-[#E11D2E]" />
                  Live Event Activity
                </h3>
                <span className="text-[11px] font-extrabold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded-full border-2 border-emerald-200 uppercase">
                  Realtime
                </span>
              </div>

              {recentActivities.length === 0 ? (
                <div className="py-12 text-center text-[#6B7280] space-y-2">
                  <Clock size={28} className="mx-auto text-[#94A3B8]" />
                  <p className="text-xs font-extrabold text-[#111827]">Waiting for event activity...</p>
                  <p className="text-[11px] text-[#6B7280] font-semibold">
                    Activities will appear live here as participants log in, start tasks, and submit posters.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivities.map((act) => (
                    <div key={act.id} className="p-3 bg-[#F3EEE7] rounded-xl border-2 border-[#111111] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 border-[#111111] ${
                          act.isSubmission
                            ? 'bg-emerald-50 text-[#16A34A]'
                            : 'bg-amber-50 text-amber-600'
                        }`}>
                          {act.roll_number.slice(-3)}
                        </div>
                        <div>
                          <div className="font-extrabold text-[#111827]">{act.roll_number}</div>
                          <div className="text-[11px] text-[#6B7280] font-semibold">{act.action}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        {act.isSubmission && (
                          <span className="font-extrabold text-[#E11D2E] block">
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

            <div className="pt-4 border-t-2 border-dashed border-[#111111]/20 text-[11px] text-[#6B7280] flex items-center justify-between font-bold">
              <span>Auto-syncing via Supabase Realtime</span>
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
            </div>
          </div>

        </div>

        {/* 7. PARTICIPANTS & LEADERBOARD TABLE — kept clean/readable for data density */}
        <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[4px_4px_0px_0px_#111111] overflow-hidden space-y-4 p-6">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-dashed border-[#111111]/20 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-[#111827] flex items-center gap-2">
                <Users size={18} className="text-[#E11D2E]" />
                Registered Participants Roster
              </h3>
              <p className="text-xs text-[#6B7280] mt-0.5 font-semibold">Manually registered 2nd & 3rd year participants preserved in registration order</p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              
              <button
                onClick={() => {
                  setAddError('');
                  setAddSuccess('');
                  setShowAddModal(true);
                }}
                className="flex items-center gap-2 px-3.5 py-2 bg-[#E11D2E] hover:bg-[#c8121f] text-xs font-extrabold text-white rounded-full border-2 border-[#111111] transition cursor-pointer"
              >
                <UserPlus size={14} />
                <span>Add Participant</span>
              </button>

              <div className="relative flex-1 md:w-56">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="text"
                  placeholder="Search roll, name, dept..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F3EEE7] border-2 border-[#111111] rounded-full pl-9 pr-3 py-2 text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#E11D2E] transition font-semibold"
                />
              </div>

              <div className="flex items-center bg-[#F3EEE7] p-1 rounded-full border-2 border-[#111111] text-xs">
                {['ALL', 'pending', 'started', 'submitted'].map(f => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`px-2.5 py-1 rounded-full font-extrabold text-[11px] uppercase transition cursor-pointer ${
                      statusFilter === f
                        ? 'bg-[#111111] text-white'
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
                className="bg-[#F3EEE7] border-2 border-[#111111] rounded-full px-3 py-2 text-xs text-[#111827] focus:outline-none cursor-pointer font-extrabold"
              >
                <option value="order">Registration Order</option>
                <option value="rank">Sort by Rank</option>
                <option value="score">Sort by Score</option>
                <option value="roll">Sort by Roll No</option>
                <option value="speed">Sort by Speed</option>
              </select>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#374151]">
              <thead className="bg-[#F3EEE7] text-[#111111] uppercase font-extrabold text-[11px] tracking-wider border-b-2 border-[#111111]">
                <tr>
                  <th className="py-3.5 px-4 text-center w-16">Order</th>
                  <th className="py-3.5 px-4">Register Number</th>
                  <th className="py-3.5 px-4">Participant Name</th>
                  <th className="py-3.5 px-4 text-center">Year</th>
                  <th className="py-3.5 px-4 text-center">Speed (Time Taken)</th>
                  <th className="py-3.5 px-4 text-right">Score (/100)</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111111]/10">
                {filteredLeaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#6B7280] space-y-2">
                      <Clock size={28} className="mx-auto text-[#94A3B8]" />
                      <p className="text-sm font-extrabold text-[#111827]">No participant records found</p>
                      <p className="text-xs text-[#6B7280] font-semibold">
                        {searchQuery ? "Try resetting your search query" : "Click 'Add Participant' to register students for the event."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredLeaderboard.map((p, index) => {
                    const orderNum = p.regIndex || index + 1;
                    
                    return (
                      <tr 
                        key={p.id || p.roll_number}
                        className="hover:bg-[#F3EEE7] transition group"
                      >
                        {/* Order Number */}
                        <td className="py-3.5 px-4 text-center font-bold">
                          <span className="text-[#111111] font-mono text-xs bg-[#F3EEE7] px-2 py-0.5 rounded-full border border-[#111111]/30">
                            #{orderNum}
                          </span>
                        </td>

                        {/* Roll Number */}
                        <td className="py-3.5 px-4 font-mono font-bold text-[#111827]">
                          {p.roll_number}
                        </td>

                        {/* Participant Name */}
                        <td className="py-3.5 px-4 font-semibold text-[#111827]">
                          {p.name}
                        </td>

                        {/* Year */}
                        <td className="py-3.5 px-4 text-center font-bold">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                            p.year === 3 
                              ? 'bg-purple-50 text-purple-700 border-purple-200' 
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {p.year === 3 ? '3rd Year' : '2nd Year'}
                          </span>
                        </td>

                        {/* Speed / Time Taken */}
                        <td className="py-3.5 px-4 text-center font-mono font-bold">
                          {p.status === 'submitted' ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md text-xs font-bold">
                              ⏱️ {formatDuration(p.durationMs)}
                            </span>
                          ) : p.status === 'started' ? (
                            <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md text-xs font-bold animate-pulse">
                              ⏳ {formatDuration(p.durationMs)}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs font-medium">—</span>
                          )}
                        </td>

                        {/* Score */}
                        <td className="py-3.5 px-4 text-right font-bold">
                          <span className={p.final_score > 0 ? "text-[#E11D2E] font-black text-sm" : "text-[#9CA3AF]"}>
                            {Number(p.final_score || 0).toFixed(1)}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                            p.status === 'submitted'
                              ? 'bg-emerald-50 text-[#16A34A] border-emerald-200'
                              : p.status === 'started'
                              ? 'bg-amber-50 text-amber-600 border-amber-200'
                              : 'bg-gray-100 text-gray-500 border-gray-200'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer Summary */}
          <div className="flex items-center justify-between text-xs text-[#6B7280] pt-2 border-t-2 border-dashed border-[#111111]/20 font-bold">
            <span>Showing {filteredLeaderboard.length} of {leaderboard.length} participants</span>
            <span>Manual Admin Registration Active</span>
          </div>

        </div>

      </main>

      {/* ADD PARTICIPANT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg">
            <div className="absolute inset-0 translate-x-3 translate-y-3 bg-[#111111] rounded-2xl" />
            <div className="relative bg-white border-4 border-[#111111] rounded-2xl overflow-hidden">

              {/* Modal Header */}
              <div className="px-6 py-4 border-b-2 border-dashed border-[#111111]/20 flex items-center justify-between bg-[#F3EEE7]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#E11D2E] border-2 border-[#111111] text-white flex items-center justify-center font-bold">
                    <UserPlus size={16} />
                  </div>
                  <div>
                    <h3 className="font-display text-base text-[#111827] tracking-wide">ADD NEW PARTICIPANT</h3>
                    <p className="text-xs text-[#6B7280] font-semibold">Manually register a student for Round 1</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 rounded-full text-[#6B7280] hover:text-[#111827] hover:bg-white transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleAddParticipantSubmit} className="p-6 space-y-4">
                
                {addError && (
                  <div className="p-3 rounded-lg bg-[#E11D2E]/10 border-2 border-[#E11D2E] text-[#c8121f] text-xs font-bold flex items-center gap-2">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{addError}</span>
                  </div>
                )}

                {addSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-50 border-2 border-emerald-400 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                    <span>{addSuccess}</span>
                  </div>
                )}

                {/* Field 1: Batch Number / Register Number & Full Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-[#374151] uppercase tracking-wider mb-1.5">
                      Batch Number / Register Number <span className="text-[#E11D2E]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 23IT001 or 24CS015"
                      value={addForm.rollNumber}
                      onChange={(e) => setAddForm({ ...addForm, rollNumber: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F3EEE7] border-2 border-[#111111] rounded-lg text-xs font-mono font-bold text-[#111827] focus:border-[#E11D2E] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-[#374151] uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-[#E11D2E]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={addForm.name}
                      onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F3EEE7] border-2 border-[#111111] rounded-lg text-xs font-semibold text-[#111827] focus:border-[#E11D2E] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Field 2: Year of Study */}
                <div>
                  <label className="block text-xs font-extrabold text-[#374151] uppercase tracking-wider mb-1.5">
                    Year of Study <span className="text-[#E11D2E]">*</span>
                  </label>
                  <select
                    value={addForm.year}
                    onChange={(e) => setAddForm({ ...addForm, year: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#F3EEE7] border-2 border-[#111111] rounded-lg text-xs font-extrabold text-[#111827] focus:border-[#E11D2E] focus:outline-none cursor-pointer"
                  >
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                  </select>
                </div>

                {/* Modal Actions */}
                <div className="pt-4 border-t-2 border-dashed border-[#111111]/20 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2.5 bg-[#F3EEE7] hover:bg-gray-200 text-xs font-extrabold text-[#374151] rounded-full border-2 border-[#111111] transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmittingParticipant}
                    className="px-5 py-2.5 bg-[#E11D2E] hover:bg-[#c8121f] disabled:opacity-50 text-xs font-extrabold text-white rounded-full border-2 border-[#111111] shadow-[3px_3px_0px_0px_#111111] hover:shadow-[1px_1px_0px_0px_#111111] transition-all cursor-pointer flex items-center gap-2 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  >
                    {isSubmittingParticipant ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Adding Participant...
                      </>
                    ) : (
                      <>
                        <UserPlus size={14} />
                        Register Participant
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t-4 border-[#111111] py-4 px-6 text-center text-xs text-[#6B7280] bg-white font-bold">
        © 2026 Poster Competition Admin Operations Console • 2nd & 3rd Year • Manual Participant Registration Active
      </footer>

    </div>
  );
};

export default AdminDashboardPage;