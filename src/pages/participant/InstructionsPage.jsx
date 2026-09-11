import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { startParticipantRound } from '../../services/supabase';
import { Clock, ShieldCheck, LogOut, ArrowRight, AlertCircle, Target, Award, Eye, MousePointerClick, Crosshair, Send, TimerReset, Layers, Sparkles } from 'lucide-react';

const InstructionsPage = () => {
  const { profile, logout, refreshProfile } = useAuth();
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleStartRound = async () => {
    setIsStarting(true);
    setError('');

    try {
      const { error: startError } = await startParticipantRound(profile.id);
      if (startError) throw startError;

      await refreshProfile();
      navigate('/challenge');
    } catch (err) {
      console.error(err);
      setError('Could not start round. Please try again or contact organizers.');
    } finally {
      setIsStarting(false);
    }
  };

  const stats = [
    { icon: Clock, value: '25 min', label: 'Timed round duration' },
    { icon: Target, value: '10 tasks', label: 'Layout workspaces' },
    { icon: Award, value: '100 pts', label: 'Max precision score' },
    { icon: ShieldCheck, value: 'Top 30', label: 'Advance to Round 2' },
  ];

  const guidelines = [
    { num: '01', icon: Eye, title: 'Read each task carefully', desc: "Each task specifies exact position (X, Y), dimensions (W, H), colors, text, and alignment parameters." },
    { num: '02', icon: MousePointerClick, title: 'Interactive design editor', desc: 'Interact directly with the 800×600 pixel white canvas or use the Inspector panel for precision values.' },
    { num: '03', icon: Crosshair, title: 'Exact coordinate scoring', desc: "Server evaluation scores your accuracy within a precise ±3px tolerance window for full score calculation." },
    { num: '04', icon: Send, title: 'Single final submission attempt', desc: 'Once submitted or when the 25-minute timer expires, your poster JSON is evaluated automatically.' },
    { num: '05', icon: TimerReset, title: 'Timer starts upon clicking "Start Round"', desc: 'Closing or refreshing your browser window will NOT pause or reset the 25-minute competition timer.', full: true },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white relative overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');
        .font-sans { font-family: 'Inter', system-ui, sans-serif; }
<<<<<<< HEAD
        .font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }

        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.94); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes ctaPulseIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        .anim-navbar { animation: fadeSlideDown 0.5s ease-out both; }
        .anim-stat { opacity: 0; animation: fadeScaleIn 0.45s ease-out forwards; }
        .anim-heading { opacity: 0; animation: fadeSlideUp 0.5s ease-out forwards; animation-delay: 0.15s; }
        .anim-guideline { opacity: 0; animation: fadeSlideUp 0.45s ease-out forwards; }
        .anim-cta { opacity: 0; animation: ctaPulseIn 0.5s ease-out forwards; animation-delay: 0.75s; }

        @media (prefers-reduced-motion: reduce) {
          .anim-navbar, .anim-stat, .anim-heading, .anim-guideline, .anim-cta {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
=======
        .font-mono { font-family: 'JetBrains Mono', monospace; }
>>>>>>> e70b992 (264001 current code)
      `}</style>

      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[32rem] h-[32rem] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[28rem] h-[28rem] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-12 py-8 relative z-10">

        {/* NAVBAR */}
<<<<<<< HEAD
        <nav className="anim-navbar pb-8 border-b border-[#E5E7EB]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xl font-bold tracking-tight block text-[#111827]">
                Design-Event
              </span>
              <span className="text-xs text-[#6B7280] block font-medium mt-0.5">
                Poster Design 2026 · Round 1
              </span>
=======
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
                  Poster Design 2026 · Round 1
                </span>
              </div>
>>>>>>> e70b992 (264001 current code)
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full font-mono text-xs font-medium text-slate-300">
                <span className="text-slate-500">ID:</span>
                <span className="text-blue-400 font-semibold">{profile?.roll_number}</span>
                <span className="text-slate-600">|</span>
                <span>{profile?.name}</span>
              </div>

              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full font-mono text-xs font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Round 01 Ready
              </span>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut size={14} /> <span>Sign out</span>
              </button>
            </div>
          </div>
        </header>

        {/* HERO INTRO */}
        <section className="pt-10 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs font-semibold text-blue-400 mb-4">
            <Sparkles size={14} /> Competitor Briefing
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Welcome, <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">{profile?.name || 'Participant'}</span>
          </h1>
          <p className="text-base text-slate-400 max-w-2xl leading-relaxed">
            Review the competition guidelines and evaluation scoring parameters before launching your timed 25-minute workspace session.
          </p>
        </section>

<<<<<<< HEAD
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="anim-stat bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3 transition-transform hover:-translate-y-0.5"
                style={{ animationDelay: `${0.25 + i * 0.08}s` }}
              >
                <div className="shrink-0 w-9 h-9 rounded-full bg-[#EFF6FF] flex items-center justify-center">
                  <s.icon size={16} className="text-[#2563EB]" />
                </div>
                <div>
                  <span className="text-base font-bold block leading-none text-[#111827]">{s.value}</span>
                  <span className="text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF] mt-1 block">{s.label}</span>
=======
        {/* STAT CARDS */}
        <section className="py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md transition-all hover:border-slate-700">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
                  <s.icon size={18} className="text-blue-400" />
>>>>>>> e70b992 (264001 current code)
                </div>
                <span className="text-2xl font-extrabold text-white block leading-none">{s.value}</span>
                <span className="text-xs font-medium text-slate-400 mt-1.5 block">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

<<<<<<< HEAD
        {/* INSTRUCTIONS */}
        <section className="py-10">
          <span className="anim-heading text-xs font-semibold uppercase tracking-[0.2em] text-[#9CA3AF] mb-2 block">
            Competition instructions
          </span>
          <h1 className="anim-heading text-3xl sm:text-4xl font-bold tracking-tight mb-6 text-[#111827]">
            Read before you start.
          </h1>

          {error && (
            <div className="mb-5 flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-lg animate-[fadeSlideUp_0.3s_ease-out]">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
              <span className="text-xs font-medium text-red-700 leading-relaxed">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {guidelines.map((step, i) => (
              <div
                key={step.num}
                className={`anim-guideline bg-white border border-[#E5E7EB] rounded-xl p-5 transition-transform hover:-translate-y-0.5 ${step.full ? 'md:col-span-2' : ''}`}
                style={{ animationDelay: `${0.4 + i * 0.08}s` }}
=======
        {/* GUIDELINES GRID */}
        <section className="py-6">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-4 block font-semibold">
            // RULES &amp; EVALUATION CRITERIA
          </span>

          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-400" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guidelines.map(step => (
              <div
                key={step.num}
                className={`bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-6 transition-all backdrop-blur-sm ${step.full ? 'md:col-span-2 bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/20 border-blue-900/30' : ''}`}
>>>>>>> e70b992 (264001 current code)
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-blue-400 font-mono font-bold text-sm">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
                      <step.icon size={16} className="text-blue-400 shrink-0" />
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

<<<<<<< HEAD
        {/* START ROUND CTA */}
        <section className="anim-cta pb-12 flex flex-col items-center text-center">
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full font-mono text-xs font-medium text-[#374151]">
              <Clock size={14} /> 25 min round
            </span>
            <span className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full font-mono text-xs font-medium text-[#374151]">
              <ShieldCheck size={14} /> Single attempt
            </span>
          </div>

          <button
            onClick={handleStartRound}
            disabled={isStarting}
            className="flex items-center gap-2 px-8 py-4 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-sm font-semibold text-white transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98]"
          >
            {isStarting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full motion-safe:animate-spin" />
                Launching
              </>
            ) : (
              <>
                Start round
                <ArrowRight size={16} strokeWidth={2.5} />
              </>
            )}
          </button>
=======
        {/* START CTA */}
        <section className="pt-6 pb-12 flex flex-col items-center text-center">
          <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 max-w-xl w-full flex flex-col items-center">
            <h3 className="text-xl font-bold text-white mb-2">Ready to start your round?</h3>
            <p className="text-sm text-slate-400 mb-6">
              Clicking the button below will immediately initialize your 25-minute timer.
            </p>

            <button
              onClick={handleStartRound}
              disabled={isStarting}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-base font-semibold shadow-lg shadow-blue-600/25 transition-all cursor-pointer hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0"
            >
              {isStarting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Launching Workspace...
                </>
              ) : (
                <>
                  Start Round 1
                  <ArrowRight size={18} strokeWidth={2.2} />
                </>
              )}
            </button>
          </div>
>>>>>>> e70b992 (264001 current code)
        </section>
      </div>
    </div>
  );
};

export default InstructionsPage;