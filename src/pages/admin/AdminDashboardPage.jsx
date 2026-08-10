import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/AuthContext';
import { getAdminStatsService, getAdminLeaderboardService, supabase } from '../../services/supabase';
import { Users, Play, CheckCircle, Clock, Download, RefreshCw, LogOut } from 'lucide-react';

const AdminDashboardPage = () => {
  const { logout } = useAuth();

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    pending: 0,
    avgScore: 0,
    maxScore: 0
  });
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    const statsRes = await getAdminStatsService();
    const leaderRes = await getAdminLeaderboardService();

    if (statsRes.data) setStats(statsRes.data);
    if (leaderRes.data) {
      // Process and sort leaderboard records
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

      // Sort: 1) Score Descending, 2) Duration Ms Ascending (Ties broken by speed)
      processed.sort((a, b) => {
        const scoreDiff = Number(b.final_score) - Number(a.final_score);
        if (Math.abs(scoreDiff) > 0.001) return scoreDiff;
        
        // If scores are equal, faster time wins
        const timeA = a.durationMs || Infinity;
        const timeB = b.durationMs || Infinity;
        return timeA - timeB;
      });

      setLeaderboard(processed);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();

    // Enable realtime listening to update scores dynamically
    const channel = supabase
      .channel('admin_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'participants' }, () => {
        fetchDashboardData();
      })
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

    const headers = ['Rank', 'Roll Number', 'Name', 'Score', 'Duration', 'Status'];
    const rows = leaderboard.map((p, idx) => [
      idx + 1,
      p.roll_number,
      p.name,
      Number(p.final_score).toFixed(2),
      formatDuration(p.durationMs),
      p.status
    ]);

    const csvContent = 
      "data:text/csv;charset=utf-8," + 
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leaderboard_all.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-gray-100 font-sans px-8 py-8 flex flex-col justify-between">
      <div className="space-y-8 flex-grow">
        
        {/* Admin Header */}
        <header className="flex justify-between items-center border-b border-gray-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-indigo-500/20">
              A
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Event Dashboard</h1>
              <p className="text-xs text-gray-500 font-semibold">Real-time Competition Monitoring Console</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              className="p-2.5 bg-gray-900 border border-gray-850 hover:bg-gray-800 rounded-xl text-gray-400 hover:text-white transition cursor-pointer"
              title="Refresh Stats"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded-xl shadow-lg transition cursor-pointer"
            >
              <Download size={14} />
              Export CSV
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#282932] hover:bg-red-500/10 hover:text-red-400 text-xs font-bold text-gray-400 rounded-xl transition cursor-pointer"
            >
              <LogOut size={14} />
              Exit
            </button>
          </div>
        </header>



        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="p-5 bg-gray-900/30 border border-gray-800 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/25 rounded-xl text-indigo-400 shrink-0">
              <Users size={20} />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Total Pool</span>
              <span className="text-xl font-bold text-white">{stats.total}</span>
            </div>
          </div>

          <div className="p-5 bg-gray-900/30 border border-gray-800 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-amber-400 shrink-0">
              <Play size={20} className="animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Active</span>
              <span className="text-xl font-bold text-white">{stats.active}</span>
            </div>
          </div>

          <div className="p-5 bg-gray-900/30 border border-gray-800 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400 shrink-0">
              <CheckCircle size={20} />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Completed</span>
              <span className="text-xl font-bold text-white">{stats.completed}</span>
            </div>
          </div>

          <div className="p-5 bg-gray-900/30 border border-gray-800 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-gray-500/10 border border-gray-500/25 rounded-xl text-gray-400 shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Not Started</span>
              <span className="text-xl font-bold text-white">{stats.pending}</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-gray-900/30 to-indigo-950/20 border border-indigo-900/20 rounded-2xl flex items-center gap-4 col-span-2 lg:col-span-1">
            <div>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Avg Score</span>
              <span className="text-xl font-black text-white">{stats.avgScore}</span>
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-gray-900/30 to-purple-950/20 border border-purple-900/20 rounded-2xl flex items-center gap-4 col-span-2 lg:col-span-1">
            <div>
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">Top Score</span>
              <span className="text-xl font-black text-white">{stats.maxScore}</span>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-[#14151a] border border-gray-850 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-gray-850 bg-[#171820]">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Evaluation Leaderboard</h3>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-sm">No participant profiles found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-850 text-gray-500 font-bold uppercase bg-[#171820]/50">
                    <th className="px-6 py-3.5">Rank</th>
                    <th className="px-6 py-3.5">Roll Number</th>
                    <th className="px-6 py-3.5">Name</th>

                    <th className="px-6 py-3.5">Score</th>
                    <th className="px-6 py-3.5">Completion Speed</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Selection</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-900">
                  {leaderboard.map((p, idx) => {
                    const isTop30 = idx < 30 && p.status === 'submitted';
                    const hasSubmitted = p.status === 'submitted';

                    return (
                      <tr 
                        key={p.id} 
                        className={`hover:bg-gray-900/60 transition ${isTop30 ? 'bg-indigo-600/5' : ''}`}
                      >
                        <td className="px-6 py-4 font-bold text-gray-400">
                          {idx + 1}
                        </td>
                        <td className="px-6 py-4 font-semibold text-white">
                          {p.roll_number}
                        </td>
                        <td className="px-6 py-4 text-gray-300 font-medium">
                          {p.name}
                        </td>

                        <td className="px-6 py-4">
                          <span className={`font-black text-sm ${hasSubmitted ? 'text-indigo-400' : 'text-gray-650'}`}>
                            {hasSubmitted ? Number(p.final_score).toFixed(2) : '0.00'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 font-mono">
                          {hasSubmitted ? formatDuration(p.durationMs) : 'Running / Idle'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                            ${p.status === 'submitted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              p.status === 'started' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse' :
                              'bg-gray-800/40 text-gray-500 border border-gray-800'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {isTop30 ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
                              Top 30 Pass
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-600 font-bold">---</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-600 text-xs mt-8">
        &copy; 2026 Poster Competition Admins Console.
      </footer>
    </div>
  );
};

export default AdminDashboardPage;
