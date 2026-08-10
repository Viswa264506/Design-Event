import React, { useEffect, useState } from 'react';
import { useAuth } from '../../services/AuthContext';
import { getSubmissionResult } from '../../services/supabase';
import { CheckCircle2, Award, LogOut } from 'lucide-react';

const ResultPage = () => {
  const { profile, logout } = useAuth();
  const [submission, setSubmission] = useState(null);
  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (profile?.id) {
        setLoadingResults(true);
        const { submission: sub, results: res } = await getSubmissionResult(profile.id);
        if (sub) setSubmission(sub);
        if (res) {
          // Sort results by task ID to match index order
          const sortedRes = [...res].sort((a, b) => a.task_id.localeCompare(b.task_id));
          setResults(sortedRes);
        }
        setLoadingResults(false);
      }
    };
    fetchResults();
  }, [profile]);

  return (
    <div className="min-h-screen bg-[#0d0e12] text-gray-100 flex flex-col justify-between font-sans px-6 py-8 relative">
      {/* Decorative gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[450px] h-[450px] rounded-full bg-emerald-600/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="max-w-4xl mx-auto w-full flex justify-between items-center border-b border-gray-800 pb-6 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md">
            D
          </div>
          <span className="font-bold text-lg tracking-wide text-white">
            DESIGN FEST 2026
          </span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1 text-sm font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </header>

      {/* Score Summary Display */}
      <main className="max-w-3xl mx-auto w-full flex-grow flex flex-col justify-center py-10 z-10">
        <div className="p-8 rounded-2xl bg-gray-900/40 border border-gray-800 backdrop-blur-md shadow-2xl flex flex-col items-center">
          
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 shadow-lg shadow-emerald-500/5">
            <CheckCircle2 size={36} />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white text-center mb-1">Challenge Completed!</h1>
          <p className="text-sm text-gray-400 text-center mb-8">
            Thank you, <span className="font-semibold text-white">{profile?.name}</span> ({profile?.roll_number}). Your design JSON was evaluated.
          </p>

          {/* Aggregate score card */}
          <div className="w-full max-w-sm py-6 px-8 rounded-2xl bg-[#14151a] border border-gray-800 text-center mb-10 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
            <span className="text-xs text-gray-500 font-bold uppercase tracking-widest block mb-1">Final Score</span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
                {submission ? Number(submission.total_score).toFixed(1) : '0.0'}
              </span>
              <span className="text-gray-500 font-bold text-sm">/ 100</span>
            </div>
            <p className="text-xs text-indigo-400 mt-2 font-medium">Evaluation complete</p>
          </div>

          {/* Breakdown List */}
          <div className="w-full space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Scorecard Breakdown</h3>
            
            {loadingResults ? (
              <div className="flex justify-center py-6">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-6 text-gray-500 text-xs">No individual task results generated.</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {results.map((res, index) => (
                  <div key={res.id} className="p-4 bg-[#14151a]/50 border border-gray-850 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wide">
                        Task {index + 1}: {res.task_id.replace('task_', '')}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-1 max-w-[200px] truncate" title={res.evaluation_details?.feedback || 'N/A'}>
                        {res.evaluation_details?.feedback || 'Perfect placement'}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-indigo-400">
                        {Number(res.score).toFixed(1)}
                      </span>
                      <span className="text-[10px] text-gray-500"> / 10</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-600 text-xs">
        Event Administrator ID check: {profile?.id ? `Verified (${profile.id.substring(0,8)})` : 'Unverified'}
      </footer>
    </div>
  );
};

export default ResultPage;
