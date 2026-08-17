import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { startParticipantRound } from '../../services/supabase';
import { Clock, ShieldCheck, LogOut, ArrowRight, AlertCircle, Target, Award, Eye, MousePointerClick, Crosshair, Send, TimerReset } from 'lucide-react';

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
    { icon: Clock, value: '25 MIN', label: 'Timed round', bg: 'bg-white', text: 'text-[#111111]', rot: '-rotate-1' },
    { icon: Target, value: '10 TASKS', label: 'Layout workspaces', bg: 'bg-[#4D7CFF]', text: 'text-white', rot: 'rotate-1' },
    { icon: Award, value: '100 PTS', label: 'Max score', bg: 'bg-[#FF4D6D]', text: 'text-white', rot: 'rotate-1' },
    { icon: ShieldCheck, value: 'TOP 30', label: 'Advance to Rd 2', bg: 'bg-white', text: 'text-[#111111]', rot: '-rotate-1' },
  ];

  const guidelines = [
    { num: '01', icon: Eye, title: 'Read each task carefully', desc: 'Each task specifies exact position (X, Y), dimensions (W, H), and styling properties.', bg: 'bg-white', text: 'text-[#111111]', sub: 'text-[#111111]/60', rot: '-rotate-1' },
    { num: '02', icon: MousePointerClick, title: 'Use the design editor to match required layout', desc: 'Interact directly with the 800x600 pixel white canvas or use the Inspector panel.', bg: 'bg-[#4D7CFF]', text: 'text-white', sub: 'text-white/75', rot: 'rotate-1' },
    { num: '03', icon: Crosshair, title: 'Coordinates and dimensions matter', desc: 'Server evaluation scores your accuracy within a precise +/-3px tolerance window.', bg: 'bg-[#FF4D6D]', text: 'text-white', sub: 'text-white/75', rot: 'rotate-1' },
    { num: '04', icon: Send, title: 'Single final submission attempt', desc: 'Once submitted or when the 25-minute timer expires, your poster JSON is evaluated automatically.', bg: 'bg-white', text: 'text-[#111111]', sub: 'text-[#111111]/60', rot: '-rotate-1' },
    { num: '05', icon: TimerReset, title: 'The timer starts when you click Start Round', desc: 'Closing or refreshing your browser window will NOT pause the timer.', bg: 'bg-[#FFDE59]', text: 'text-[#111111]', sub: 'text-[#111111]/70', rot: '-rotate-1', full: true },
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

      <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-12 py-8">

        {/* NAVBAR */}
        <nav className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="font-display text-lg sm:text-xl font-bold tracking-wide block">
                DESIGN-EVENT<span className="text-[#FF4D6D]">.</span>
              </span>
              <span className="text-xs text-[#111111]/60 block font-semibold font-mono mt-0.5">Poster Design 2026 - Round 1</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="hidden sm:inline-flex items-center px-3.5 py-2 bg-white border-[3px] border-[#111111] font-mono text-xs font-bold whitespace-nowrap">
                {profile?.name} ({profile?.roll_number})
              </span>
              <span className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#111111] text-[#FFDE59] border-[3px] border-[#111111] font-mono text-[11px] font-semibold uppercase tracking-widest -rotate-2 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFDE59] motion-safe:animate-pulse" />
                Round 01
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#111111] hover:text-[#FFDE59] text-[#111111] border-[3px] border-[#111111] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap"
                title="Sign out"
              >
                <LogOut size={14} /> <span>Sign out</span>
              </button>
            </div>
          </div>
        </nav>

        {/* AT A GLANCE */}
        <section className="relative z-10 pt-10">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#111111]/60 mb-2 block">
            At a glance
          </span>
          <h2 className="font-display font-bold uppercase leading-[0.95] mb-4" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)' }}>
            Top 30 advance<br />to round 2.
          </h2>
          <p className="text-sm sm:text-base text-[#111111]/70 leading-relaxed max-w-xl mb-6 font-medium">
            Scores are based on +/-3px accuracy against each task's target layout — precision matters more than speed.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className={`${s.bg} border-[3px] border-[#111111] shadow-[5px_5px_0px_0px_#111111] p-4 ${s.rot} flex items-center gap-3`}>
                <s.icon size={20} className={`${s.text} shrink-0`} />
                <div>
                  <span className={`font-display text-lg font-bold block leading-none ${s.text}`}>{s.value}</span>
                  <span className={`text-[11px] font-mono font-semibold uppercase tracking-wide ${s.text} opacity-70`}>{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* INSTRUCTIONS */}
        <section className="relative z-10 py-10">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#111111]/60 mb-2 block">
            Competition instructions
          </span>
          <h1 className="font-display font-bold uppercase leading-[0.95] mb-6" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)' }}>
            Read before you start.
          </h1>

          {error && (
            <div className="mb-5 flex items-start gap-3 px-4 py-3 bg-white border-[3px] border-[#111111] border-l-[10px] border-l-[#FF4D6D]">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-[#FF4D6D]" />
              <span className="text-sm font-semibold leading-relaxed">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guidelines.map(step => (
              <div
                key={step.num}
                className={`relative overflow-hidden ${step.bg} border-[3px] border-[#111111] shadow-[5px_5px_0px_0px_#111111] p-5 ${step.rot} ${step.full ? 'md:col-span-2' : ''}`}
              >
                <span
                  className={`font-display font-bold absolute -right-2 -top-5 select-none pointer-events-none ${step.text} opacity-10`}
                  style={{ fontSize: '6.5rem', lineHeight: 1 }}
                >
                  {step.num}
                </span>

                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-10 h-10 bg-[#111111] border-[3px] border-[#111111] mb-3 rotate-2`}>
                    <step.icon size={18} className="text-[#FFDE59]" />
                  </div>
                  <p className={`text-sm sm:text-base leading-snug ${step.text}`}>
                    <span className="font-bold">{step.title}.</span>{' '}
                    <span className={`font-medium ${step.sub}`}>{step.desc}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* START ROUND CTA */}
        <section className="relative z-10 pb-12 flex flex-col items-center text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-6 font-mono text-xs font-bold uppercase tracking-wider">
            <span className="inline-flex items-center gap-2 px-3 py-2 bg-white border-[3px] border-[#111111] rotate-1">
              <Clock size={14} /> 25 min round
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-2 bg-white border-[3px] border-[#111111] -rotate-1">
              <ShieldCheck size={14} /> Single attempt
            </span>
          </div>

          <button
            onClick={handleStartRound}
            disabled={isStarting}
            className="press flex items-center gap-3 px-8 py-4 bg-[#FF4D6D] disabled:opacity-50 disabled:cursor-not-allowed border-[3px] border-[#111111] shadow-[6px_6px_0px_0px_#111111] font-display text-sm font-bold text-white uppercase tracking-widest transition-transform cursor-pointer focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[#111111] focus-visible:ring-offset-2"
          >
            {isStarting ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full motion-safe:animate-spin" />
                Launching
              </>
            ) : (
              <>
                Start round
                <ArrowRight size={18} strokeWidth={2.5} />
              </>
            )}
          </button>
        </section>
      </div>
    </div>
  );
};

export default InstructionsPage;