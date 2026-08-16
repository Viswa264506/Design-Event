import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { getSubmissionResult, resetParticipantStatusService } from '../../services/supabase';
import { CheckCircle2, LogOut } from 'lucide-react';

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
    <div className="font-comic-body min-h-screen bg-[#F3EEE7] text-[#111111] selection:bg-[#E11D2E] selection:text-white relative">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700&display=swap');
        .font-comic-body { font-family: 'Comic Neue', 'Comic Sans MS', cursive, sans-serif; }
        .font-display { font-family: 'Bangers', 'Archivo Black', cursive; letter-spacing: 0.03em; }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-6">

        {/* NAVBAR — matches other pages */}
        <nav className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="font-display text-xl sm:text-2xl tracking-wide text-[#E11D2E] block">
                DESIGN-EVENT<span className="text-[#111111]">.</span>
              </span>
              <span className="text-sm text-[#6B7280] block font-bold mt-0.5">Poster Design 2026 • Round 1</span>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#E11D2E] hover:text-white text-[#111111] rounded-full border-2 border-[#111111] text-sm font-extrabold transition cursor-pointer whitespace-nowrap"
              title="Exit Platform"
            >
              <LogOut size={14} /> <span>Exit</span>
            </button>
          </div>
        </nav>

        {/* SUCCESS HEADER */}
        <section className="relative z-10 pt-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#FFC700] border-2 border-[#111111] rounded-2xl flex items-center justify-center text-[#111111] mb-4 shadow-[3px_3px_0px_0px_#111111]">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-[#111111] tracking-wide">
            SUBMISSION RECEIVED!
          </h1>
          <p className="text-sm font-semibold text-[#6B7280] mt-2">
            Thank you, <span className="text-[#E11D2E] font-extrabold">{profile?.name}</span> ({profile?.roll_number}). Your design has been submitted successfully.
          </p>
        </section>

        {/* SCORE CARD */}
        <section className="relative z-10 pt-8">
          <div className="max-w-2xl mx-auto bg-white border-2 border-[#111111] rounded-2xl p-6 shadow-[4px_4px_0px_0px_#111111] text-center">
            <span className="text-sm font-extrabold text-[#6B7280] uppercase tracking-widest block mb-1">
              Final Score
            </span>
            <div className="flex items-baseline justify-center gap-1">
              <span className="font-display text-6xl text-[#E11D2E]">
                {submission ? Number(submission.total_score).toFixed(1) : '0.0'}
              </span>
              <span className="text-[#6B7280] font-extrabold text-base">/ 100</span>
            </div>
            <p className="text-sm text-[#16A34A] mt-2 font-extrabold uppercase tracking-wide">Evaluation Complete</p>
          </div>
        </section>

        {/* SCORECARD BREAKDOWN */}
        <section className="relative z-10 pt-8">
          <span className="text-xs font-extrabold text-[#E11D2E] tracking-widest uppercase mb-3 block">
            — Scorecard Breakdown
          </span>

          {loadingResults ? (
            <div className="flex justify-center py-8">
              <div className="w-5 h-5 border-2 border-[#E11D2E] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-[#6B7280] text-sm font-semibold bg-white border-2 border-[#111111] rounded-2xl">
              No individual task breakdown generated.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {results.map((res, index) => (
                <div key={res.id} className="p-5 bg-white border-2 border-[#111111] rounded-xl shadow-[3px_3px_0px_0px_#111111] flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-[#111827] uppercase tracking-wide">
                      Task {index + 1}: {res.task_id.replace('task_', '')}
                    </h4>
                    <p className="text-sm text-[#6B7280] mt-1 max-w-[220px] truncate font-semibold">
                      {res.evaluation_details?.feedback || 'Evaluated'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-display text-2xl text-[#E11D2E]">
                      {Number(res.score).toFixed(1)}
                    </span>
                    <span className="text-sm text-[#6B7280] font-bold"> / 10</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* FOOTER META / EXIT */}
        <section className="relative z-10 pt-8 pb-10 text-center border-t-2 border-dashed border-[#111111]/20 mt-8">
          <p className="text-xs font-extrabold text-[#6B7280] uppercase tracking-widest mb-3">
            Round 1 Evaluation Finalized • Participant: {profile?.roll_number}
          </p>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#6B7280] hover:text-[#E11D2E] transition cursor-pointer"
          >
            <LogOut size={14} /> Exit Platform
          </button>
        </section>
      </div>
    </div>
  );
};

export default ResultPage;