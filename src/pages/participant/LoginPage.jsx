import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { isSupabaseConfigured } from '../../services/supabase';
import { ArrowRight, Clock, Users, AlertCircle, AlertTriangle } from 'lucide-react';

const LoginPage = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAdmin, loginParticipant, loading } = useAuth();
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
    <div className="h-screen w-full overflow-hidden bg-[#F9FAFB] text-[#111827] font-sans flex flex-col lg:grid lg:grid-cols-2">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        .font-sans { font-family: 'Inter', system-ui, sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
      `}</style>

      {/* LEFT — form */}
      <div className="relative flex-1 min-h-0 lg:h-full bg-white lg:border-r border-[#E5E7EB] flex flex-col px-6 sm:px-12 py-8 sm:py-10 lg:justify-center overflow-y-auto">
        <div className="max-w-md mx-auto lg:mx-0 w-full flex-1 flex flex-col justify-between lg:justify-normal gap-0 lg:gap-10 lg:flex-none">

          {/* Top block: brand */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl sm:text-xl font-bold tracking-tight block text-[#111827]">
                Design-Event
              </span>
              <span className="text-sm sm:text-[10px] text-[#6B7280] block font-medium mt-1">
                Poster Design 2026 · Round 1
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-4 py-2.5 sm:py-1.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-full font-mono text-sm sm:text-[10px] font-semibold uppercase tracking-wider text-[#16A34A]">
              <span className="w-2 h-2 sm:w-1.5 sm:h-1.5 rounded-full bg-[#16A34A] motion-safe:animate-pulse" />
              Live
            </span>
          </div>

          {/* Middle block: heading + form */}
          <div className="py-8 sm:py-0">
            <h1 className="text-4xl sm:text-4xl font-bold tracking-tight mb-4 sm:mb-3 text-[#111827]">
              Sign in to continue
            </h1>
            <p className="text-base sm:text-base text-[#6B7280] leading-relaxed mb-8 sm:mb-8">
              Enter your registration roll number to unlock the workspace and begin Round 1.
            </p>

            {!isSupabaseConfigured && (
              <div className="mb-5 flex items-start gap-3 px-4 py-3.5 sm:py-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-600" />
                <p className="text-sm sm:text-xs font-medium text-amber-700 leading-relaxed">
                  Configuration warning: database credentials missing. Demo mode active.
                </p>
              </div>
            )}

            {error && (
              <div className="mb-5 flex items-start gap-3 px-4 py-3.5 sm:py-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
                <p className="text-sm sm:text-xs font-medium text-red-700 leading-relaxed">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-5">
              <div>
                <label htmlFor="rollNumber" className="block text-sm sm:text-sm font-semibold uppercase tracking-wide text-[#6B7280] mb-2.5 sm:mb-3">
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
                  className="w-full px-5 py-5 sm:py-4 bg-white border border-[#E5E7EB] rounded-xl font-mono text-lg sm:text-lg font-medium tracking-wide text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-5 sm:py-4 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-base sm:text-base font-semibold text-white transition-colors cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full motion-safe:animate-spin" />
                    Connecting
                  </>
                ) : (
                  <>
                    Enter competition
                    <ArrowRight size={17} strokeWidth={2.5} />
                  </>
                )}
              </button>
            </form>

            <div className="flex flex-wrap gap-3 mt-8 sm:mt-8">
              <span className="inline-flex items-center gap-2 px-4 py-2.5 sm:py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full text-sm sm:text-sm font-medium text-[#374151]">
                <Clock size={16} /> 25 min
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2.5 sm:py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full text-sm sm:text-sm font-medium text-[#374151]">
                <Users size={16} /> 2nd &amp; 3rd year
              </span>
            </div>

            <p className="hidden lg:block mt-10 text-xs font-medium text-[#9CA3AF] leading-relaxed max-w-sm">
              Trouble logging in? Check with your event coordinator before the round starts.
            </p>
          </div>

          {/* About section — mobile only */}
          <div className="lg:hidden pt-8 border-t border-[#E5E7EB]">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9CA3AF]">
              About the event
            </span>
            <p className="text-base text-[#6B7280] leading-relaxed mt-4 mb-6">
              Ten timed tasks, one workspace, one poster to submit before the clock runs out.
              Round 1 tests speed, taste, and execution under pressure.
            </p>
            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 text-center">
                <span className="block text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">Tasks</span>
                <span className="text-xl font-bold text-[#111827]">10</span>
              </div>
              <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 text-center">
                <span className="block text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">Time</span>
                <span className="text-xl font-bold text-[#111827]">25m</span>
              </div>
              <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 text-center">
                <span className="block text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">Year</span>
                <span className="text-xl font-bold text-[#111827]">2/3</span>
              </div>
              <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 text-center">
                <span className="block text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">Type</span>
                <span className="text-xl font-bold text-[#111827]">Solo</span>
              </div>
            </div>
            <p className="text-sm font-medium text-[#9CA3AF] leading-relaxed">
              Trouble logging in? Check with your event coordinator before the round starts.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT — about the event (desktop only) */}
      <div className="relative hidden lg:flex lg:h-full items-center bg-[#F9FAFB] px-6 sm:px-12 py-10">
        <div className="max-w-md mx-auto lg:mx-0 w-full">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9CA3AF]">
            About the event
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-3 mb-4 text-[#111827]">
            A design sprint for creative minds
          </h2>
          <p className="text-sm text-[#6B7280] leading-relaxed mb-8 max-w-sm">
            Ten timed tasks, one workspace, and a single poster to submit before the clock
            runs out. Round 1 tests speed, taste, and execution under pressure.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF] mb-1">Tasks</span>
              <span className="text-xl font-bold text-[#111827]">10</span>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF] mb-1">Duration</span>
              <span className="text-xl font-bold text-[#111827]">25 min</span>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF] mb-1">Eligibility</span>
              <span className="text-base font-bold text-[#111827]">2nd &amp; 3rd yr</span>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF] mb-1">Format</span>
              <span className="text-base font-bold text-[#111827]">Individual</span>
            </div>
          </div>

          <p className="mt-6 text-xs font-medium text-[#9CA3AF] leading-relaxed">
            Trouble logging in? Check with your event coordinator before the round starts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;