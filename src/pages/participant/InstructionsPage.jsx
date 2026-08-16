import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { startParticipantRound } from '../../services/supabase';
import { Clock, ShieldCheck, LogOut, ArrowRight, AlertCircle, Target, Award } from 'lucide-react';

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
    { icon: Clock, value: '25 MIN', label: 'Timed Round' },
    { icon: Target, value: '10 TASKS', label: 'Layout Workspaces' },
    { icon: Award, value: '100 PTS', label: 'Max Score' },
    { icon: ShieldCheck, value: 'TOP 30', label: 'Advance to Rd 2' },
  ];

  const guidelines = [
    { num: '01', title: 'Read each task carefully', desc: 'Each task specifies exact position (X, Y), dimensions (W, H), and styling properties.' },
    { num: '02', title: 'Use the design editor to match required layout', desc: 'Interact directly with the 800×600 pixel white canvas or use the Inspector panel.' },
    { num: '03', title: 'Coordinates and dimensions matter', desc: 'Server evaluation scores your accuracy within a precise ±3px tolerance window.' },
    { num: '04', title: 'Single final submission attempt', desc: 'Once submitted or when the 25-minute timer expires, your poster JSON is evaluated automatically.' },
    { num: '05', title: 'The timer starts when you click Start Round', desc: 'Closing or refreshing your browser window will NOT pause the timer.' }
  ];

  return (
    <div className="font-comic-body min-h-screen bg-[#F3EEE7] text-[#111111] selection:bg-[#E11D2E] selection:text-white relative">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700&display=swap');
        .font-comic-body { font-family: 'Comic Neue', 'Comic Sans MS', cursive, sans-serif; }
        .font-display { font-family: 'Bangers', 'Archivo Black', cursive; letter-spacing: 0.03em; }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-6">

        {/* NAVBAR — matches LoginPage */}
        <nav className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="font-display text-xl sm:text-2xl tracking-wide text-[#E11D2E] block">
                DESIGN-EVENT<span className="text-[#111111]">.</span>
              </span>
              <span className="text-sm text-[#6B7280] block font-bold mt-0.5">Poster Design 2026 • Round 1</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border-2 border-[#111111] text-sm sm:text-base font-extrabold text-[#111827] whitespace-nowrap">
                {profile?.name} ({profile?.roll_number})
              </span>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border-2 border-[#111111] text-sm sm:text-base whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                <span className="text-[#111827] font-extrabold">ROUND 1</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#E11D2E] hover:text-white text-[#111111] rounded-full border-2 border-[#111111] text-sm font-extrabold transition cursor-pointer whitespace-nowrap"
                title="Sign Out"
              >
                <LogOut size={14} /> <span>Sign Out</span>
              </button>
            </div>
          </div>
        </nav>

        {/* AT A GLANCE */}
        <section className="relative z-10 pt-8">
          <span className="text-sm font-extrabold text-[#E11D2E] tracking-widest uppercase mb-2 block">
            — At a Glance
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-[#111111] tracking-wide mb-4">
            Top 30 Advance To Round 2.
          </h2>
          <p className="text-base text-[#6B7280] font-semibold leading-relaxed max-w-xl mb-6">
            Scores are based on ±3px accuracy against each task's target layout — precision matters more than speed.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white border-2 border-[#111111] rounded-2xl p-5 shadow-[4px_4px_0px_0px_#111111] flex items-center gap-3">
                <s.icon size={22} className="text-[#E11D2E] shrink-0" />
                <div>
                  <span className="font-display text-2xl text-[#111827] block leading-none">{s.value}</span>
                  <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wide">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* INSTRUCTIONS */}
        <section className="relative z-10 py-8">
          <span className="text-sm font-extrabold text-[#E11D2E] tracking-widest uppercase mb-2 block">
            — Competition Instructions
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-[#111111] tracking-wide mb-6">
            Read Before You Start.
          </h1>

          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-[#E11D2E]/10 border-2 border-[#E11D2E] text-[#c8121f] text-sm font-bold flex items-center gap-2">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2.5">
            {guidelines.map(step => (
              <div key={step.num} className="px-5 py-3.5 bg-white border-2 border-[#111111] rounded-full shadow-[3px_3px_0px_0px_#111111] flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-[#111111] text-[#FFC700] font-display text-sm flex items-center justify-center shrink-0">
                  {step.num}
                </span>
                <p className="text-sm sm:text-base text-[#111111] font-semibold leading-snug truncate">
                  <span className="font-extrabold">{step.title}.</span>{' '}
                  <span className="text-[#6B7280]">{step.desc}</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* START ROUND CTA */}
        <section className="relative z-10 pb-10 flex flex-col items-center text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-6 text-base font-bold">
            <div className="flex items-center gap-2 text-[#374151]">
              <Clock size={18} className="text-[#E11D2E]" /> 25 Min Round
            </div>
            <div className="flex items-center gap-2 text-[#374151]">
              <ShieldCheck size={18} className="text-[#E11D2E]" /> Single Attempt
            </div>
          </div>

          <button
            onClick={handleStartRound}
            disabled={isStarting}
            className="flex items-center gap-3 px-8 py-4 bg-[#E11D2E] hover:bg-[#c8121f] disabled:opacity-50 text-base font-extrabold text-white rounded-full border-2 border-[#111111] shadow-[4px_4px_0px_0px_#111111] hover:shadow-[1px_1px_0px_0px_#111111] transition-all cursor-pointer tracking-wider uppercase active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            {isStarting ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Launching...
              </>
            ) : (
              <>
                Start Round
                <ArrowRight size={18} strokeWidth={3} />
              </>
            )}
          </button>
        </section>
      </div>
    </div>
  );
};

export default InstructionsPage;