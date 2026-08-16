import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { isSupabaseConfigured } from '../../services/supabase';
import { ArrowRight, Clock, Shield, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAdmin, loginParticipant, logout, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && !isAdmin) {
      navigate('/instructions');
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!rollNumber.trim()) {
      setError('Please enter your registration Roll Number.');
      return;
    }

    setIsSubmitting(true);
    const { error: loginError } = await loginParticipant(rollNumber.trim());
    setIsSubmitting(false);

    if (loginError) {
      let friendlyError = loginError.message || 'Login failed. Please check your credentials or network connection.';
      if (friendlyError.includes('Invalid roll number')) {
        friendlyError = 'Please enter a valid registration Roll Number.';
      } else if (friendlyError.includes('Not registered')) {
        friendlyError = 'This roll number is not registered for this event.';
      } else if (friendlyError.includes('Wrong year')) {
        friendlyError = "This participant is not registered for this year's competition.";
      } else if (friendlyError.includes('Already active')) {
        friendlyError = 'This roll number is already active on another device session.';
      } else if (friendlyError.includes('Already completed')) {
        friendlyError = 'You have already submitted and completed Round 1.';
      }
      setError(friendlyError);
    } else {
      navigate('/instructions');
    }
  };

  return (
    <div className="font-comic-body h-screen bg-[#F3EEE7] text-[#111111] selection:bg-[#E11D2E] selection:text-white flex flex-col overflow-hidden relative">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700&display=swap');
        .font-comic-body { font-family: 'Comic Neue', 'Comic Sans MS', cursive, sans-serif; }
        .font-display { font-family: 'Bangers', 'Archivo Black', cursive; letter-spacing: 0.03em; }
      `}</style>

      {/* NAVBAR */}
      <nav className="relative z-10 px-6 py-4 shrink-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <span className="font-display text-xl sm:text-2xl tracking-wide text-[#E11D2E] block">
              DESIGN-EVENT<span className="text-[#111111]">.</span>
            </span>
            <span className="text-xs text-[#6B7280] block font-bold mt-0.5">Poster Design 2026 • Round 1</span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border-2 border-[#111111] text-xs sm:text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[#111827] font-extrabold">ROUND 1</span>
          </div>
        </div>
      </nav>

      {/* HERO — flows directly on the page, no card wrappers */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-6 flex-1 min-h-0 flex items-center py-2 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">

          {/* LEFT — headline + form */}
          <div>
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider border-2 border-[#111111] bg-amber-50 text-amber-600 mb-5">
              — The Ultimate
            </span>

            <h1
              className="font-display whitespace-nowrap tracking-wide leading-[0.9] mb-4"
              style={{ fontSize: 'clamp(3.25rem, 6vw, 5.75rem)' }}
            >
              <span className="text-[#111111]">POSTER </span>
              <span className="text-[#E11D2E]">DESIGN.</span>
            </h1>

            {!isSupabaseConfigured && (
              <div className="mb-4 p-3.5 rounded-lg bg-[#FFC700]/20 border-2 border-[#FFC700] text-[#8a6d1f] text-sm font-extrabold flex items-center gap-2 max-w-md">
                <AlertCircle size={18} className="shrink-0" />
                Configuration Warning: Database credentials missing. Demo mode active.
              </div>
            )}

            {error && (
              <div className="mb-4 p-3.5 rounded-lg bg-[#E11D2E]/10 border-2 border-[#E11D2E] text-[#c8121f] text-sm font-bold flex items-center gap-2 max-w-md">
                <AlertCircle size={18} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="max-w-md">
              <label htmlFor="rollNumber" className="block text-sm font-extrabold text-[#374151] uppercase tracking-wider mb-2">
                Registration Roll Number <span className="text-[#E11D2E]">*</span>
              </label>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  id="rollNumber"
                  type="text"
                  placeholder="e.g. 274001"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  disabled={isSubmitting}
                  autoFocus
                  className="w-full px-5 py-4 bg-white border-2 border-[#111111] rounded-lg text-base font-mono font-bold text-[#111827] focus:border-[#E11D2E] focus:outline-none transition-all"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-3 px-8 py-4 bg-[#E11D2E] hover:bg-[#c8121f] disabled:opacity-50 text-base font-extrabold text-white rounded-full border-2 border-[#111111] shadow-[4px_4px_0px_0px_#111111] hover:shadow-[1px_1px_0px_0px_#111111] transition-all cursor-pointer tracking-wider uppercase active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      Enter Competition
                      <ArrowRight size={18} strokeWidth={3} />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-5 pt-4 border-t-2 border-dashed border-[#111111]/20 text-sm font-bold max-w-md">
              <div className="flex items-center gap-2 text-[#374151]">
                <Clock size={18} className="text-[#E11D2E]" /> 25 Min Round
              </div>
              <div className="flex items-center gap-2 text-[#374151]">
                <Shield size={18} className="text-[#E11D2E]" /> 2nd &amp; 3rd Year
              </div>
            </div>
          </div>

          {/* RIGHT — About the event, flowing directly, no card */}
          <div>
            <span className="text-sm font-extrabold text-[#E11D2E] uppercase tracking-wider">— About The Event</span>
            <h3 className="font-display text-3xl sm:text-4xl text-[#111827] mt-3 mb-4 tracking-wide leading-tight">
              A Design Sprint For Creative Minds.
            </h3>
            <p className="text-base text-[#6B7280] font-semibold leading-relaxed max-w-lg">
              Enter your roll number to unlock the workspace, complete ten design tasks,
              and submit your best poster before the clock runs out.
            </p>

            {/* stat chips, no card wrapper — just floating on the page */}
            <div className="grid grid-cols-2 gap-5 mt-6 max-w-md">
              <div className="bg-white border-2 border-[#111111] rounded-2xl p-5 shadow-[4px_4px_0px_0px_#111111]">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280] block mb-1.5">Tasks</span>
                <span className="font-display text-3xl text-[#111827]">10</span>
              </div>
              <div className="bg-[#E11D2E] border-2 border-[#111111] rounded-2xl p-5 shadow-[4px_4px_0px_0px_#111111]">
                <span className="text-xs font-extrabold uppercase tracking-wider text-white/70 block mb-1.5">Round</span>
                <span className="font-display text-3xl text-white">25+ Min</span>
              </div>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
};

export default LoginPage;