import React, { useEffect, useState } from 'react';
import { useAuth } from '../../services/AuthContext';
import { getSubmissionResult } from '../../services/supabase';
import { CheckCircle2, LogOut, Layers } from 'lucide-react';

const ResultPage = () => {
  const { profile, logout } = useAuth();
  const [submission, setSubmission] = useState(null);
  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (profile?.id) {
        setLoadingResults(true);
        const submissionId = sessionStorage.getItem('design_event_last_submission_id');
        const { submission: sub, results: res } = await getSubmissionResult(profile.id, submissionId);
        if (sub) setSubmission(sub);
        if (res) {
          const sortedRes = [...res].sort((a, b) => a.task_id.localeCompare(b.task_id));
          setResults(sortedRes);
        }
        setLoadingResults(false);
      }
    };
    fetchResults();
  }, [profile]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white relative overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap');
        .font-sans { font-family: 'Inter', system-ui, sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[25rem] bg-blue-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 py-8 relative z-10">

        {/* NAVBAR */}
        <header className="pb-8 border-b border-slate-800/80">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
                <Layers className="text-white" size={20} />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white block">
                  Design-Event
                </span>
                <span className="text-xs text-slate-400 block font-medium">
                  Poster Design 2026 · Round 1 Evaluation
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-full text-xs font-semibold transition-colors cursor-pointer"
              title="Exit platform"
            >
              <LogOut size={14} /> <span>Exit Platform</span>
            </button>
          </div>
        </header>

        {/* SUCCESS HEADER */}
        <section className="pt-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            Round 1 Submitted!
          </h1>
          <p className="text-base text-slate-400 max-w-lg">
            Great work, <strong className="text-white">{profile?.name}</strong> (<span className="font-mono text-blue-400">{profile?.roll_number}</span>). Your design has been evaluated server-side.
          </p>
        </section>

        {/* SCORE CARD */}
        <section className="pt-8">
          <div className="max-w-md mx-auto bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400" />
            
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 block mb-3 font-semibold">
              // ACCURACY SCORE EVALUATION
            </span>
            
            <div className="flex items-baseline justify-center gap-2 my-2">
              <span className="text-6xl sm:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 tracking-tight font-mono">
                {submission ? Number(submission.total_score).toFixed(1) : '0.0'}
              </span>
              <span className="text-slate-500 font-bold text-xl font-mono">/ 100</span>
            </div>

            <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full font-mono text-xs font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AUTOMATED SERVER EVALUATION COMPLETE
            </div>
          </div>
        </section>

        {/* SCORECARD BREAKDOWN */}
        <section className="pt-12">
          <div className="flex items-center justify-between mb-5">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">
              // TASK SCORECARD BREAKDOWN (10 WORKSPACES)
            </span>
            <span className="text-xs font-mono text-slate-500">
              ±3px Coordinate Precision Window
            </span>
          </div>

          {loadingResults ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono text-slate-400">Loading task scores...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10 text-sm font-medium text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl">
              No individual task breakdown generated.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {results.map((res, index) => (
                <div key={res.id} className="p-5 bg-slate-900/70 border border-slate-800/80 rounded-2xl flex items-center justify-between hover:border-slate-700 transition-all backdrop-blur-sm">
                  <div className="min-w-0 pr-3">
                    <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <span className="font-mono text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        #{String(index + 1).padStart(2, '0')}
                      </span>
                      Task {res.task_id.replace('task_', '')}
                    </h4>
                    <p className="text-xs mt-1.5 max-w-[220px] truncate text-slate-400 font-medium">
                      {res.evaluation_details?.feedback || 'Evaluated accuracy'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-2xl font-bold font-mono text-white">
                      {Number(res.score).toFixed(1)}
                    </span>
                    <span className="text-xs font-mono text-slate-500"> / 10</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* FOOTER META / EXIT */}
        <section className="pt-10 pb-12 text-center border-t border-slate-800/80 mt-12">
          <p className="text-xs font-mono text-slate-500 mb-4">
            ROUND 1 EVALUATION FINALIZED · COMPETITOR ID: {profile?.roll_number}
          </p>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut size={14} /> Exit Platform
          </button>
        </section>
      </div>
    </div>
  );
};

export default ResultPage;