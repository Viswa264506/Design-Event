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

  const cardStyles = [
    { bg: 'bg-white', text: 'text-[#111111]', sub: 'text-[#111111]/55', rot: '-rotate-1' },
    { bg: 'bg-[#4D7CFF]', text: 'text-white', sub: 'text-white/70', rot: 'rotate-1' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#111111] font-sans relative">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', 'Archivo Black', sans-serif; }
        .font-sans { font-family: 'Inter', system-ui, sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        .press:active { transform: translate(4px, 4px); box-shadow: 0 0 0 #111111 !important; }
      `}</style>

      <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 py-8">

        {/* NAVBAR */}
        <nav className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-display text-lg sm:text-xl font-bold tracking-wide block">
                DESIGN-EVENT<span className="text-[#FF4D6D]">.</span>
              </span>
              <span className="text-xs text-[#111111]/60 block font-semibold font-mono mt-0.5">Poster Design 2026 - Round 1</span>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#111111] hover:text-[#FFDE59] text-[#111111] border-[3px] border-[#111111] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap"
              title="Exit platform"
            >
              <LogOut size={14} /> <span>Exit</span>
            </button>
          </div>
        </nav>

        {/* SUCCESS HEADER */}
        <section className="relative z-10 pt-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#FFDE59] border-[3px] border-[#111111] shadow-[4px_4px_0px_0px_#111111] flex items-center justify-center text-[#111111] mb-4 -rotate-3">
            <CheckCircle2 size={30} />
          </div>
          <h1 className="font-display font-bold uppercase leading-[0.95]" style={{ fontSize: 'clamp(1.8rem, 3.6vw, 2.6rem)' }}>
            Submission received!
          </h1>
          <p className="text-sm font-medium text-[#111111]/60 mt-3">
            Thank you, <span className="text-[#FF4D6D] font-bold">{profile?.name}</span> ({profile?.roll_number}). Your design has been submitted successfully.
          </p>
        </section>

        {/* SCORE CARD */}
        <section className="relative z-10 pt-8">
          <div className="max-w-lg mx-auto bg-[#111111] border-[3px] border-[#111111] shadow-[6px_6px_0px_0px_#FFDE59] p-8 text-center">
            <span className="font-mono text-xs font-bold text-[#F5F1E8]/60 uppercase tracking-[0.25em] block mb-2">
              Final score
            </span>
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="font-display text-6xl sm:text-7xl font-bold text-[#FFDE59]">
                {submission ? Number(submission.total_score).toFixed(1) : '0.0'}
              </span>
              <span className="text-[#F5F1E8]/60 font-bold text-base font-mono">/ 100</span>
            </div>
            <p className="text-xs text-[#F5F1E8] mt-3 font-bold uppercase tracking-widest font-mono">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#16A34A] mr-2 align-middle" />
              Evaluation complete
            </p>
          </div>
        </section>

        {/* SCORECARD BREAKDOWN */}
        <section className="relative z-10 pt-10">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#111111]/60 mb-4 block">
            Scorecard breakdown
          </span>

          {loadingResults ? (
            <div className="flex justify-center py-10">
              <div className="w-5 h-5 border-2 border-[#FF4D6D] border-t-transparent rounded-full motion-safe:animate-spin" />
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10 text-sm font-semibold text-[#111111]/60 bg-white border-[3px] border-[#111111]">
              No individual task breakdown generated.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {results.map((res, index) => {
                const style = cardStyles[index % cardStyles.length];
                return (
                  <div key={res.id} className={`p-5 ${style.bg} border-[3px] border-[#111111] shadow-[5px_5px_0px_0px_#111111] flex items-center justify-between ${style.rot}`}>
                    <div className="min-w-0">
                      <h4 className={`text-sm font-bold uppercase tracking-wide ${style.text}`}>
                        Task {index + 1}: {res.task_id.replace('task_', '')}
                      </h4>
                      <p className={`text-xs mt-1 max-w-[220px] truncate font-medium ${style.sub}`}>
                        {res.evaluation_details?.feedback || 'Evaluated'}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <span className={`font-display text-2xl font-bold ${style.text}`}>
                        {Number(res.score).toFixed(1)}
                      </span>
                      <span className={`text-xs font-mono font-semibold ${style.sub}`}> / 10</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* FOOTER META / EXIT */}
        <section className="relative z-10 pt-10 pb-12 text-center border-t-[3px] border-dashed border-[#111111]/20 mt-8">
          <p className="font-mono text-[11px] font-bold text-[#111111]/50 uppercase tracking-widest mb-3">
            Round 1 evaluation finalized - Participant: {profile?.roll_number}
          </p>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#111111]/60 hover:text-[#FF4D6D] transition-colors cursor-pointer"
          >
            <LogOut size={14} /> Exit platform
          </button>
        </section>
      </div>
    </div>
  );
};

export default ResultPage;