import React, { useEffect, useState } from 'react';
import { useAuth } from '../../services/AuthContext';
import { getSubmissionResult } from '../../services/supabase';
import { Sparkles, CheckCircle2, LogOut } from 'lucide-react';

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
          const sortedRes = [...res].sort((a, b) => a.task_id.localeCompare(b.task_id));
          setResults(sortedRes);
        }
        setLoadingResults(false);
      }
    };
    fetchResults();
  }, [profile]);

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#111827] flex flex-col justify-between font-sans px-6 py-8 relative select-none">
      
      {/* Header Bar */}
      <header className="max-w-4xl mx-auto w-full flex justify-between items-center bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#2563EB] rounded-xl flex items-center justify-center font-extrabold text-white shadow-md shadow-[#2563EB]/20">
            <Sparkles size={18} />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-[#111827] uppercase block">
              DESIGN-EVENT
            </span>
            <span className="text-xs font-semibold text-[#6B7280]">
              Poster Design — Round 1 Evaluation
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="text-xs font-semibold text-[#6B7280] hover:text-red-600 flex items-center gap-1.5 transition cursor-pointer"
        >
          <LogOut size={14} /> Exit Platform
        </button>
      </header>

      {/* Score Summary Display */}
      <main className="max-w-3xl mx-auto w-full flex-grow flex flex-col justify-center py-10 z-10">
        <div className="p-8 rounded-2xl bg-white border border-[#E5E7EB] shadow-xl flex flex-col items-center">
          
          <div className="w-14 h-14 bg-[#EFF6FF] border border-[#2563EB]/30 rounded-2xl flex items-center justify-center text-[#2563EB] mb-5 shadow-sm">
            <CheckCircle2 size={32} />
          </div>

          <h1 className="text-2xl font-black tracking-tight text-[#111827] text-center mb-1">
            ✓ Submission Received
          </h1>
          <p className="text-xs font-semibold text-[#6B7280] text-center mb-8">
            Thank you, <span className="text-[#111827] font-bold">{profile?.name}</span> ({profile?.roll_number}). Your design has been submitted successfully.
          </p>

          {/* Aggregate Score Card */}
          <div className="w-full max-w-sm py-6 px-8 rounded-2xl bg-[#F8FAFF] border border-[#E5E7EB] text-center mb-8 relative overflow-hidden shadow-inner">
            <div className="absolute top-0 inset-x-0 h-[3px] bg-[#2563EB]" />
            <span className="text-[11px] text-[#6B7280] font-bold uppercase tracking-widest block mb-1">
              Final Score
            </span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-black text-[#2563EB]">
                {submission ? Number(submission.total_score).toFixed(1) : '0.0'}
              </span>
              <span className="text-[#6B7280] font-bold text-sm">/ 100</span>
            </div>
            <p className="text-xs text-[#16A34A] mt-2 font-bold">Evaluation Complete</p>
          </div>

          {/* Scorecard Breakdown List */}
          <div className="w-full space-y-3">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">
              Scorecard Breakdown
            </h3>
            
            {loadingResults ? (
              <div className="flex justify-center py-6">
                <div className="w-5 h-5 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-6 text-[#6B7280] text-xs font-semibold">No individual task breakdown generated.</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-2.5">
                {results.map((res, index) => (
                  <div key={res.id} className="p-3.5 bg-[#F8FAFF] border border-[#E5E7EB] rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wide">
                        Task {index + 1}: {res.task_id.replace('task_', '')}
                      </h4>
                      <p className="text-[10px] text-[#6B7280] mt-0.5 max-w-[180px] truncate font-medium">
                        {res.evaluation_details?.feedback || 'Evaluated'}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-black text-[#2563EB]">
                        {Number(res.score).toFixed(1)}
                      </span>
                      <span className="text-[10px] text-[#6B7280] font-bold"> / 10</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-[#6B7280] font-medium">
        Round 1 Evaluation Finalized • Participant: {profile?.roll_number}
      </footer>
    </div>
  );
};

export default ResultPage;
