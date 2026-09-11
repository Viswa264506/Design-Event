import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { isSupabaseConfigured } from '../../services/supabase';
import { ArrowRight, Clock, Users, AlertCircle, AlertTriangle, Layers, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

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
    <div className="min-h-screen w-full bg-[#0B0F17] text-slate-100 font-sans flex flex-col lg:grid lg:grid-cols-12 overflow-hidden relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');
        .font-sans { font-family: 'Inter', system-ui, sans-serif; }
<<<<<<< HEAD
        .font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-2%, 3%) scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .enter-item {
          opacity: 0;
          animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .enter-1 { animation-delay: 0.05s; }
        .enter-2 { animation-delay: 0.15s; }
        .enter-3 { animation-delay: 0.25s; }
        .enter-4 { animation-delay: 0.35s; }
        .enter-5 { animation-delay: 0.45s; }
        .enter-6 { animation-delay: 0.55s; }
        .enter-7 { animation-delay: 0.65s; }

        .ambient-glow {
          animation: drift 12s ease-in-out infinite;
        }

        .stat-card {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .stat-card:hover {
          transform: translateY(-3px);
          border-color: #D1D5DB;
          box-shadow: 0 8px 20px -6px rgba(17, 24, 39, 0.08);
        }

        .cta-button {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease, background-color 0.2s ease;
          box-shadow: 0 1px 2px rgba(37, 99, 235, 0.05);
        }
        .cta-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -8px rgba(37, 99, 235, 0.45);
        }
        .cta-button:active:not(:disabled) {
          transform: translateY(0px);
        }

        .roll-input {
          transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
        }
        .roll-input:focus {
          transform: translateY(-1px);
        }

        .live-dot-ring {
          box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.4);
          animation: pulseRing 2s ease-out infinite;
        }
        @keyframes pulseRing {
          0% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.35); }
          70% { box-shadow: 0 0 0 6px rgba(22, 163, 74, 0); }
          100% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); }
        }

        .pill-chip {
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .pill-chip:hover {
          transform: translateY(-2px);
          border-color: #D1D5DB;
        }

        @media (prefers-reduced-motion: reduce) {
          .enter-item, .ambient-glow, .live-dot-ring, .stat-card, .cta-button, .roll-input, .pill-chip {
            animation: none !important;
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
=======
        .font-mono { font-family: 'JetBrains Mono', monospace; }
>>>>>>> e70b992 (264001 current code)
      `}</style>

      {/* Ambient background glow & grid lines */}
      <div className="absolute -top-40 -left-40 w-[36rem] h-[36rem] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-[40rem] h-[40rem] bg-indigo-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[30rem] h-[30rem] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" />

<<<<<<< HEAD
          {/* Top block: brand */}
          <div className="enter-item enter-1 flex items-center justify-between">
            <div>
              <span className="text-2xl sm:text-xl font-bold tracking-tight block text-[#111827]">
                Design-Event
              </span>
              <span className="text-sm sm:text-[10px] text-[#6B7280] block font-medium mt-1">
                Poster Design 2026 · Round 1
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-4 py-2.5 sm:py-1.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-full font-mono text-sm sm:text-[10px] font-semibold uppercase tracking-wider text-[#16A34A]">
              <span className="live-dot-ring w-2 h-2 sm:w-1.5 sm:h-1.5 rounded-full bg-[#16A34A]" />
              Live
            </span>
          </div>

          {/* Middle block: heading + form */}
          <div className="py-8 sm:py-0">
            <h1 className="enter-item enter-2 text-4xl sm:text-4xl font-bold tracking-tight mb-4 sm:mb-3 text-[#111827]">
              Sign in to continue
            </h1>
            <p className="enter-item enter-3 text-base sm:text-base text-[#6B7280] leading-relaxed mb-8 sm:mb-8">
              Enter your registration roll number to unlock the workspace and begin Round 1.
            </p>

            {!isSupabaseConfigured && (
              <div className="mb-5 flex items-start gap-3 px-4 py-3.5 sm:py-3 bg-amber-50 border border-amber-200 rounded-lg animate-[scaleIn_0.3s_ease-out]">
                <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-600" />
                <p className="text-sm sm:text-xs font-medium text-amber-700 leading-relaxed">
                  Configuration warning: database credentials missing. Demo mode active.
=======
      {/* LEFT — Brand & Interactive Sign In Card (7 cols on lg) */}
      <div className="relative lg:col-span-7 flex flex-col justify-between px-6 sm:px-12 py-10 lg:py-12 z-10 overflow-y-auto">
        <div className="max-w-xl mx-auto lg:mx-0 w-full flex-1 flex flex-col justify-between gap-10">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
                <Layers className="text-white" size={20} />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white block">
                  Design-Event
                </span>
                <span className="text-xs text-slate-400 block font-medium">
                  Poster Design 2026 · Round 1
                </span>
              </div>
            </div>

            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full font-mono text-xs font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              LIVE COMPETITION
            </span>
          </div>

          {/* Form Box */}
          <div className="my-auto py-6 sm:py-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs font-semibold text-blue-400 mb-6">
              <Sparkles size={14} /> Participant Portal
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Sign in to unlock <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
                your workspace
              </span>
            </h1>
            <p className="text-base text-slate-400 leading-relaxed mb-8 max-w-lg">
              Enter your registration roll number to launch the timed design workspace and submit your Round 1 entry.
            </p>

            {!isSupabaseConfigured && (
              <div className="mb-6 flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-sm">
                <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-400" />
                <p className="leading-relaxed">
                  <strong className="font-semibold text-amber-200">Demo mode active:</strong> Supabase credentials not detected. You can test with any 6-digit roll number (e.g., 274001).
>>>>>>> e70b992 (264001 current code)
                </p>
              </div>
            )}

            {error && (
<<<<<<< HEAD
              <div className="mb-5 flex items-start gap-3 px-4 py-3.5 sm:py-3 bg-red-50 border border-red-200 rounded-lg animate-[scaleIn_0.3s_ease-out]">
                <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
                <p className="text-sm sm:text-xs font-medium text-red-700 leading-relaxed">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-5">
              <div className="enter-item enter-4">
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
                  className="roll-input w-full px-5 py-5 sm:py-4 bg-white border border-[#E5E7EB] rounded-xl font-mono text-lg sm:text-lg font-medium tracking-wide text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB]"
                />
=======
              <div className="mb-6 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-400" />
                <p className="leading-relaxed font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
              <div>
                <label htmlFor="rollNumber" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
                  Registration Roll Number
                </label>
                <div className="relative">
                  <input
                    id="rollNumber"
                    type="text"
                    placeholder="e.g. 274001"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    disabled={isSubmitting}
                    autoFocus
                    autoComplete="off"
                    className="w-full px-5 py-4 bg-slate-900/90 border border-slate-700/80 rounded-xl font-mono text-xl font-semibold text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all shadow-inner"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs font-mono">
                    NUMERIC
                  </div>
                </div>
>>>>>>> e70b992 (264001 current code)
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
<<<<<<< HEAD
                className="cta-button enter-item enter-5 w-full flex items-center justify-center gap-2 px-6 py-5 sm:py-4 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-base sm:text-base font-semibold text-white cursor-pointer"
=======
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-base font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
>>>>>>> e70b992 (264001 current code)
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Connecting to Session...
                  </>
                ) : (
                  <>
                    Enter Workspace
                    <ArrowRight size={18} strokeWidth={2.2} />
                  </>
                )}
              </button>
            </form>

<<<<<<< HEAD
            <div className="enter-item enter-6 flex flex-wrap gap-3 mt-8 sm:mt-8">
              <span className="pill-chip inline-flex items-center gap-2 px-4 py-2.5 sm:py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full text-sm sm:text-sm font-medium text-[#374151]">
                <Clock size={16} /> 25 min
              </span>
              <span className="pill-chip inline-flex items-center gap-2 px-4 py-2.5 sm:py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full text-sm sm:text-sm font-medium text-[#374151]">
                <Users size={16} /> 2nd &amp; 3rd year
              </span>
            </div>

            <p className="enter-item enter-7 hidden lg:block mt-10 text-xs font-medium text-[#9CA3AF] leading-relaxed max-w-sm">
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
              <div className="stat-card bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 text-center">
                <span className="block text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">Tasks</span>
                <span className="text-xl font-bold text-[#111827]">10</span>
              </div>
              <div className="stat-card bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 text-center">
                <span className="block text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">Time</span>
                <span className="text-xl font-bold text-[#111827]">25m</span>
              </div>
              <div className="stat-card bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 text-center">
                <span className="block text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">Year</span>
                <span className="text-xl font-bold text-[#111827]">2/3</span>
              </div>
              <div className="stat-card bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4 text-center">
                <span className="block text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">Type</span>
                <span className="text-xl font-bold text-[#111827]">Solo</span>
              </div>
            </div>
            <p className="text-sm font-medium text-[#9CA3AF] leading-relaxed">
              Trouble logging in? Check with your event coordinator before the round starts.
            </p>
=======
            <div className="flex flex-wrap items-center gap-4 mt-8 pt-8 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-900/80 px-3.5 py-2 rounded-lg border border-slate-800">
                <Clock size={15} className="text-blue-400" />
                <span>25-Minute Timed Session</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-900/80 px-3.5 py-2 rounded-lg border border-slate-800">
                <Users size={15} className="text-indigo-400" />
                <span>2nd &amp; 3rd Year Individual</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/60 pt-6">
            <span>Design-Event Studio Platform v2.0</span>
            <button
              onClick={() => navigate('/admin/login')}
              className="text-slate-400 hover:text-white transition-colors underline underline-offset-4 font-medium cursor-pointer"
            >
              Admin Console Sign In →
            </button>
>>>>>>> e70b992 (264001 current code)
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* RIGHT — about the event (desktop only) */}
      <div className="relative hidden lg:flex lg:h-full items-center bg-[#F9FAFB] px-6 sm:px-12 py-10 overflow-hidden">
        {/* ambient glow accents */}
        <div className="ambient-glow pointer-events-none absolute -top-24 -right-16 w-96 h-96 rounded-full bg-[#2563EB]/[0.06] blur-3xl" />
        <div className="ambient-glow pointer-events-none absolute -bottom-32 -left-10 w-80 h-80 rounded-full bg-[#16A34A]/[0.05] blur-3xl" style={{ animationDelay: '2s' }} />

        <div className="relative max-w-md mx-auto lg:mx-0 w-full">
          <span className="enter-item enter-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#9CA3AF]">
            About the event
          </span>
          <h2 className="enter-item enter-3 text-2xl sm:text-3xl font-bold tracking-tight mt-3 mb-4 text-[#111827]">
            A design sprint for creative minds
          </h2>
          <p className="enter-item enter-4 text-sm text-[#6B7280] leading-relaxed mb-8 max-w-sm">
            Ten timed tasks, one workspace, and a single poster to submit before the clock
            runs out. Round 1 tests speed, taste, and execution under pressure.
          </p>

          <div className="enter-item enter-5 grid grid-cols-2 gap-3">
            <div className="stat-card bg-white border border-[#E5E7EB] rounded-xl p-4">
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF] mb-1">Tasks</span>
              <span className="text-xl font-bold text-[#111827]">10</span>
            </div>
            <div className="stat-card bg-white border border-[#E5E7EB] rounded-xl p-4">
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF] mb-1">Duration</span>
              <span className="text-xl font-bold text-[#111827]">25 min</span>
            </div>
            <div className="stat-card bg-white border border-[#E5E7EB] rounded-xl p-4">
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF] mb-1">Eligibility</span>
              <span className="text-base font-bold text-[#111827]">2nd &amp; 3rd yr</span>
            </div>
            <div className="stat-card bg-white border border-[#E5E7EB] rounded-xl p-4">
              <span className="block text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF] mb-1">Format</span>
              <span className="text-base font-bold text-[#111827]">Individual</span>
            </div>
          </div>

          <p className="enter-item enter-6 mt-6 text-xs font-medium text-[#9CA3AF] leading-relaxed">
            Trouble logging in? Check with your event coordinator before the round starts.
          </p>
=======
      {/* RIGHT — Showcase & Stat Cards (5 cols on lg) */}
      <div className="relative lg:col-span-5 hidden lg:flex flex-col justify-between p-12 bg-slate-900/60 border-l border-slate-800/80 backdrop-blur-xl z-10">
        <div className="space-y-8 my-auto">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-blue-400 block mb-2 font-semibold">
              // EVENT SPRINT OVERVIEW
            </span>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-3">
              A high-stakes poster design challenge
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Test your design accuracy, speed, and execution under pressure across 10 layout challenges evaluated in real-time.
            </p>
          </div>

          {/* 2x2 Feature Cards Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-md">
              <span className="text-xs font-semibold text-slate-400 block mb-1">TASKS</span>
              <div className="text-3xl font-extrabold text-white">10</div>
              <p className="text-xs text-slate-400 mt-1">Interactive layout goals</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-md">
              <span className="text-xs font-semibold text-slate-400 block mb-1">DURATION</span>
              <div className="text-3xl font-extrabold text-white">25m</div>
              <p className="text-xs text-slate-400 mt-1">Strict auto-submit clock</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-md">
              <span className="text-xs font-semibold text-slate-400 block mb-1">EVALUATION</span>
              <div className="text-3xl font-extrabold text-blue-400">±3px</div>
              <p className="text-xs text-slate-400 mt-1">Precision coordinate scoring</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-md">
              <span className="text-xs font-semibold text-slate-400 block mb-1">FORMAT</span>
              <div className="text-3xl font-extrabold text-indigo-400">Solo</div>
              <p className="text-xs text-slate-400 mt-1">Individual competitor</p>
            </div>
          </div>

          {/* Highlights List */}
          <div className="p-5 rounded-2xl bg-blue-950/30 border border-blue-800/40 space-y-3">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <CheckCircle2 size={16} className="text-blue-400 shrink-0" />
              <span>Real-time element canvas editing &amp; properties panel</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <CheckCircle2 size={16} className="text-blue-400 shrink-0" />
              <span>Automated server evaluation upon round completion</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <ShieldCheck size={16} className="text-indigo-400 shrink-0" />
              <span>Top 30 participants advance to Round 2</span>
            </div>
          </div>
>>>>>>> e70b992 (264001 current code)
        </div>

        <p className="text-xs text-slate-500">
          Need help? Reach out to your event hall invigilator before initiating the round timer.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;