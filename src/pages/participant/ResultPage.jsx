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
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .font-sans { font-family: 'Inter', system-ui, sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
      `}</style>

      <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 py-8">

        {/* NAVBAR */}
        <nav className="pb-8 border-b border-[#E5E7EB]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xl font-bold tracking-tight block text-[#111827]">
                Design-Event
              </span>
              <span className="text-xs text-[#6B7280] block font-medium mt-0.5">
                Poster Design 2026 · Round 1
              </span>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#F9FAFB] text-[#374151] border border-[#E5E7EB] rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
              title="Exit platform"
            >
              <LogOut size={14} /> <span>Exit</span>
            </button>
          </div>
        </nav>

        {/* SUCCESS HEADER */}
        <section className="pt-10 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#16A34A] mb-4">
            <CheckCircle2 size={26} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827]">
            Submission received!
          </h1>
          <p className="text-sm text-[#6B7280] mt-3">
            Thank you, <span className="text-[#111827] font-semibold">{profile?.name}</span> ({profile?.roll_number}). Your design has been submitted successfully.
          </p>
        </section>

        {/* SCORE CARD */}
        <section className="pt-8">
          <div className="max-w-lg mx-auto bg-white border border-[#E5E7EB] rounded-2xl p-8 text-center">
            <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-[0.2em] block mb-2">
              Final score
            </span>
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="text-6xl sm:text-7xl font-bold text-[#2563EB] tracking-tight">
                {submission ? Number(submission.total_score).toFixed(1) : '0.0'}
              </span>
              <span className="text-[#9CA3AF] font-semibold text-base font-mono">/ 100</span>
            </div>
            <p className="text-xs text-[#374151] mt-4 font-medium uppercase tracking-widest font-mono inline-flex items-center">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#16A34A] mr-2 align-middle motion-safe:animate-pulse" />
              Evaluation complete
            </p>
          </div>
        </section>

        {/* SCORECARD BREAKDOWN */}
        <section className="pt-10">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9CA3AF] mb-4 block">
            Scorecard breakdown
          </span>

          {loadingResults ? (
            <div className="flex justify-center py-10">
              <div className="w-5 h-5 border-2 border-[#2563EB] border-t-transparent rounded-full motion-safe:animate-spin" />
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10 text-sm font-medium text-[#6B7280] bg-white border border-[#E5E7EB] rounded-xl">
              No individual task breakdown generated.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {results.map((res, index) => (
                <div key={res.id} className="p-5 bg-white border border-[#E5E7EB] rounded-xl flex items-center justify-between">
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-[#111827]">
                      Task {index + 1}: {res.task_id.replace('task_', '')}
                    </h4>
                    <p className="text-xs mt-1 max-w-[220px] truncate font-medium text-[#9CA3AF]">
                      {res.evaluation_details?.feedback || 'Evaluated'}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className="text-2xl font-bold text-[#111827]">
                      {Number(res.score).toFixed(1)}
                    </span>
                    <span className="text-xs font-mono font-medium text-[#9CA3AF]"> / 10</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* FOOTER META / EXIT */}
        <section className="pt-10 pb-12 text-center border-t border-[#E5E7EB] mt-8">
          <p className="text-[11px] font-medium text-[#9CA3AF] uppercase tracking-widest mb-3 font-mono">
            Round 1 evaluation finalized · Participant: {profile?.roll_number}
          </p>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6B7280] hover:text-[#2563EB] transition-colors cursor-pointer"
          >
            <LogOut size={14} /> Exit platform
          </button>
        </section>
      </div>
    </div>
  );
};

export default ResultPage;