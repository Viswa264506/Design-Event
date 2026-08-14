import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { getSubmissionResult, resetParticipantStatusService } from '../../services/supabase';
import { CheckCircle2, LogOut, RotateCcw } from 'lucide-react';

const ResultPage = () => {
  const { profile, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [results, setResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

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

  const handleRetake = async () => {
    if (!profile?.id) return;
    setIsResetting(true);
    try {
      localStorage.removeItem(`design_event_elements_${profile.id}`);
      sessionStorage.removeItem('design_event_session_id');
      sessionStorage.removeItem('design_event_last_submission_id');
      await resetParticipantStatusService(profile.id);
      await refreshProfile();
      navigate('/challenge');
    } catch (e) {
      console.error(e);
      setIsResetting(false);
    }
  };

  return (
    <div className="font-comic-body min-h-screen bg-[#F3EEE7] text-[#111111] flex flex-col justify-between px-6 py-8 relative select-none overflow-hidden">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700&display=swap');
        .font-comic-body { font-family: 'Comic Neue', 'Comic Sans MS', cursive, sans-serif; }
        .font-display { font-family: 'Bangers', 'Archivo Black', cursive; letter-spacing: 0.03em; }
      `}</style>

      {/* Halftone dot background */}
      <div
        className="absolute inset-0 opacity-[0.2] pointer-events-none z-0"
        style={{ backgroundImage: 'radial-gradient(#111111 1.4px, transparent 1.4px)', backgroundSize: '18px 18px' }}
      />
      <svg className="absolute right-10 top-8 hidden sm:block z-0" width="34" height="34" viewBox="0 0 46 46" fill="none">
        <path d="M23 2 L27 18 L43 23 L27 28 L23 44 L19 28 L3 23 L19 18 Z" fill="#FFC700" />
      </svg>

      {/* Header Bar */}
      <header className="max-w-4xl mx-auto w-full flex justify-between items-center bg-white p-4 rounded-2xl border-4 border-[#111111] shadow-[4px_4px_0px_0px_#111111] z-10 relative">
        <div>
          <span className="font-display text-xl tracking-wide text-[#E11D2E] block">
            DESIGN-EVENT<span className="text-[#111111]">.</span>
          </span>
          <span className="text-xs font-bold text-[#6B7280]">
            Poster Design — Round 1 Evaluation
          </span>
        </div>

        <button
          onClick={logout}
          className="text-xs font-extrabold text-[#6B7280] hover:text-[#E11D2E] flex items-center gap-1.5 transition cursor-pointer"
        >
          <LogOut size={14} /> Exit Platform
        </button>
      </header>

      {/* Score Summary Display */}
      <main className="max-w-3xl mx-auto w-full flex-grow flex flex-col justify-center py-10 z-10 relative">
        <div className="relative">
          <div className="absolute inset-0 translate-x-3 translate-y-3 bg-[#111111] rounded-2xl" />
          <div className="relative p-8 rounded-2xl bg-white border-4 border-[#111111] flex flex-col items-center">

            <div className="w-16 h-16 bg-[#FFC700] border-2 border-[#111111] rounded-2xl flex items-center justify-center text-[#111111] mb-5">
              <CheckCircle2 size={32} />
            </div>

            <h1 className="font-display text-3xl tracking-tight text-[#111111] text-center mb-2">
              SUBMISSION RECEIVED!
            </h1>
            <p className="text-sm font-semibold text-[#4B5563] text-center mb-8">
              Thank you, <span className="text-[#111111] font-extrabold">{profile?.name}</span> ({profile?.roll_number}). Your design has been submitted successfully.
            </p>

            {/* Aggregate Score Card */}
            <div className="w-full max-w-sm py-6 px-8 rounded-2xl bg-[#F3EEE7] border-2 border-[#111111] text-center mb-8 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-[#E11D2E]" />
              <span className="text-xs text-[#6B7280] font-extrabold uppercase tracking-widest block mb-1">
                Final Score
              </span>
              <div className="flex items-baseline justify-center gap-1">
                <span className="font-display text-6xl text-[#E11D2E]">
                  {submission ? Number(submission.total_score).toFixed(1) : '0.0'}
                </span>
                <span className="text-[#6B7280] font-extrabold text-base">/ 100</span>
              </div>
              <p className="text-sm text-[#16A34A] mt-2 font-extrabold">Evaluation Complete</p>
            </div>

            {/* Scorecard Breakdown List */}
            <div className="w-full space-y-3 mb-8">
              <h3 className="text-sm font-extrabold text-[#111111] uppercase tracking-wider mb-3">
                Scorecard Breakdown
              </h3>

              {loadingResults ? (
                <div className="flex justify-center py-6">
                  <div className="w-5 h-5 border-2 border-[#E11D2E] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-6 text-[#6B7280] text-sm font-semibold">No individual task breakdown generated.</div>
              ) : (
                <div className="grid md:grid-cols-2 gap-2.5">
                  {results.map((res, index) => (
                    <div key={res.id} className="p-3.5 bg-[#F3EEE7] border-2 border-[#111111] rounded-xl flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-extrabold text-[#111111] uppercase tracking-wide">
                          Task {index + 1}: {res.task_id.replace('task_', '')}
                        </h4>
                        <p className="text-xs text-[#6B7280] mt-0.5 max-w-[180px] truncate font-medium">
                          {res.evaluation_details?.feedback || 'Evaluated'}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-display text-lg text-[#E11D2E]">
                          {Number(res.score).toFixed(1)}
                        </span>
                        <span className="text-xs text-[#6B7280] font-bold"> / 10</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-[#111111]/60 font-bold uppercase tracking-wide relative z-10">
        Round 1 Evaluation Finalized • Participant: {profile?.roll_number}
      </footer>
    </div>
  );
};

export default ResultPage;