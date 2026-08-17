import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { isSupabaseConfigured } from '../../services/supabase';
import { ArrowRight, Clock, Users, AlertCircle, AlertTriangle } from 'lucide-react';

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
      setError('Please enter your registration roll number.');
      return;
    }

    setIsSubmitting(true);
    const { error: loginError } = await loginParticipant(rollNumber.trim());
    setIsSubmitting(false);

    if (loginError) {
      let friendlyError = loginError.message || 'Login failed. Please check your credentials or network connection.';
      if (friendlyError.includes('Invalid roll number')) {
        friendlyError = 'Please enter a valid registration roll number.';
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
    <div className="h-screen w-full overflow-hidden bg-[#F5F1E8] text-[#111111] font-sans lg:grid lg:grid-cols-2">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', 'Archivo Black', sans-serif; }
        .font-sans { font-family: 'Inter', system-ui, sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        .press:active { transform: translate(4px, 4px); box-shadow: 0 0 0 #111111 !important; }
      `}</style>

      {/* LEFT — hero + form */}
      <div className="relative h-full bg-[#FFDE59] lg:border-r-[3px] border-[#111111] overflow-hidden px-6 sm:px-12 py-6 lg:py-8 flex flex-col justify-center">

        <span className="hidden md:block absolute -right-6 top-16 w-16 h-16 bg-[#FF4D6D] border-[3px] border-[#111111] rotate-12" />
        <span className="hidden md:block absolute right-10 bottom-10 w-10 h-10 rounded-full bg-[#4D7CFF] border-[3px] border-[#111111]" />

        <div className="relative z-10 max-w-md mx-auto lg:mx-0 w-full">
          <div className="flex items-center justify-between mb-5">
            <span className="font-display text-lg font-bold tracking-wide">
              DESIGN-EVENT<span className="text-[#FF4D6D]">.</span>
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#111111] text-[#FFDE59] border-[3px] border-[#111111] font-mono text-[11px] font-semibold uppercase tracking-widest -rotate-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFDE59] motion-safe:animate-pulse" />
              Live
            </span>
          </div>

          <span className="inline-block bg-[#111111] text-[#FFDE59] font-mono text-xs font-bold uppercase tracking-widest px-3 py-1.5 -rotate-3 mb-3">
            Round 01
          </span>

          <h1 className="font-display font-bold uppercase leading-[0.92] mb-3" style={{ fontSize: 'clamp(2.1rem, 4.4vw, 3.2rem)' }}>
            Enter the<br />arena.
          </h1>

          <p className="text-sm font-semibold text-[#111111]/80 leading-relaxed mb-5 max-w-sm">
            Enter your registration roll number to unlock the workspace and begin Round 1.
          </p>

          {!isSupabaseConfigured && (
            <div className="mb-4 flex items-start gap-3 px-4 py-2.5 bg-white border-[3px] border-[#111111]">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <p className="font-mono text-xs font-semibold leading-relaxed">
                Configuration warning: database credentials missing. Demo mode active.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 flex items-start gap-3 px-4 py-2.5 bg-white border-[3px] border-[#111111] border-l-[10px] border-l-[#FF4D6D]">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-[#FF4D6D]" />
              <p className="text-sm font-semibold leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="rollNumber" className="block font-mono text-xs font-bold uppercase tracking-widest mb-2">
                Roll number
              </label>
              <input
                id="rollNumber"
                type="text"
                placeholder="e.g. 274001"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                disabled={isSubmitting}
                autoFocus
                autoComplete="off"
                className="w-full px-4 py-3.5 bg-white border-[3px] border-[#111111] font-mono text-base font-semibold tracking-wider text-[#111111] placeholder:text-[#111111]/30 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#4D7CFF] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="press w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-[#FF4D6D] disabled:opacity-50 disabled:cursor-not-allowed border-[3px] border-[#111111] shadow-[6px_6px_0px_0px_#111111] font-display text-sm font-bold text-white uppercase tracking-widest transition-transform focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#111111] focus-visible:ring-offset-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full motion-safe:animate-spin" />
                  Connecting
                </>
              ) : (
                <>
                  Enter competition
                  <ArrowRight size={16} strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>

          <div className="flex flex-wrap gap-3 mt-4 font-mono text-xs font-bold uppercase tracking-wider">
            <span className="inline-flex items-center gap-2 px-3 py-2 bg-white border-[3px] border-[#111111] rotate-1">
              <Clock size={14} /> 25 min
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-2 bg-white border-[3px] border-[#111111] -rotate-1">
              <Users size={14} /> 2nd &amp; 3rd year
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT — about the event */}
      <div className="relative h-full flex items-center overflow-hidden px-6 sm:px-12 py-6 lg:py-8">
        <div className="max-w-md mx-auto lg:mx-0 w-full">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#111111]/60">
            About the event
          </span>
          <h2 className="font-display font-bold uppercase leading-[0.98] mt-3 mb-4" style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.3rem)' }}>
            A design sprint<br />for creative minds.
          </h2>
          <p className="text-sm text-[#111111]/70 leading-relaxed mb-6 max-w-sm">
            Ten timed tasks, one workspace, and a single poster to submit before the clock
            runs out. Round 1 tests speed, taste, and execution under pressure.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border-[3px] border-[#111111] shadow-[5px_5px_0px_0px_#111111] p-3 -rotate-1">
              <span className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#111111]/50 mb-1">Tasks</span>
              <span className="font-display text-xl font-bold">10</span>
            </div>
            <div className="bg-[#4D7CFF] border-[3px] border-[#111111] shadow-[5px_5px_0px_0px_#111111] p-3 rotate-1">
              <span className="block font-mono text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">Duration</span>
              <span className="font-display text-xl font-bold text-white">25 min</span>
            </div>
            <div className="bg-[#FF4D6D] border-[3px] border-[#111111] shadow-[5px_5px_0px_0px_#111111] p-3 rotate-1">
              <span className="block font-mono text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">Eligibility</span>
              <span className="font-display text-base font-bold text-white">2nd &amp; 3rd yr</span>
            </div>
            <div className="bg-white border-[3px] border-[#111111] shadow-[5px_5px_0px_0px_#111111] p-3 -rotate-1">
              <span className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#111111]/50 mb-1">Format</span>
              <span className="font-display text-base font-bold">Individual</span>
            </div>
          </div>

          <p className="mt-5 font-mono text-[11px] font-semibold text-[#111111]/50 leading-relaxed">
            Trouble logging in? Check with your event coordinator before the round starts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;