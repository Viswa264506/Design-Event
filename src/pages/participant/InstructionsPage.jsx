import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { startParticipantRound } from '../../services/supabase';
import { Clock, Target, Award, LogOut, ArrowRight, ShieldCheck } from 'lucide-react';

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

  return (
    <div className="font-comic-body min-h-screen bg-[#F4EE2A] text-[#0B0B0B] px-3 sm:px-5 py-4 sm:py-6 relative overflow-hidden">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700&display=swap');
        .font-comic-body { font-family: 'Comic Neue', 'Comic Sans MS', cursive, sans-serif; }
        .font-display { font-family: 'Bangers', 'Archivo Black', cursive; letter-spacing: 0.04em; }
        .dot-strip {
          background-image: radial-gradient(#0B0B0B 2px, transparent 2px);
          background-size: 10px 10px;
        }
        .dot-strip-color {
          background-image: radial-gradient(#E62429 2px, transparent 2px), radial-gradient(#F4EE2A 2px, transparent 2px);
          background-size: 10px 10px, 10px 10px;
          background-position: 0 0, 5px 5px;
        }
        .spiderverse-panel {
          background:
            radial-gradient(circle at 78% 30%, rgba(255,45,120,0.85), transparent 38%),
            radial-gradient(circle at 15% 20%, rgba(255,150,0,0.75), transparent 42%),
            radial-gradient(circle at 50% 55%, rgba(255,60,40,0.65), transparent 50%),
            radial-gradient(circle at 90% 80%, rgba(123,92,255,0.6), transparent 45%),
            radial-gradient(circle at 10% 85%, rgba(0,229,212,0.5), transparent 42%),
            linear-gradient(135deg, #2b0a3d 0%, #5a0e3e 30%, #7a1a2e 55%, #4a0e2e 80%, #16052b 100%);
        }
        .spiderverse-halftone {
          background-image: radial-gradient(rgba(255,255,255,0.5) 1.5px, transparent 1.5px);
          background-size: 7px 7px;
          mix-blend-mode: overlay;
          opacity: 0.35;
        }
        .halftone-btn {
          background-color: #FFFFFF;
          background-image: radial-gradient(rgba(11,11,11,0.18) 1px, transparent 1px);
          background-size: 10px 10px;
          background-position: -2px -2px;
        }
      `}</style>

      {/* Outer layered neon border frame */}
      <div className="absolute inset-0 bg-[#F4EE2A] z-0" />
      <div className="absolute inset-3 sm:inset-5 border-[6px] border-[#E62429] rounded-sm z-0" />
      <div className="absolute inset-[18px] sm:inset-[26px] border-[6px] border-[#FF2D78] rounded-sm z-0" />
      <div className="absolute inset-[30px] sm:inset-[42px] border-[4px] border-[#00E5D4] rounded-sm z-0" />

      {/* top dot strip */}
      <div className="absolute top-3 sm:top-5 left-3 sm:left-5 right-3 sm:right-5 h-2 dot-strip-color z-10" />

      <div className="relative z-10 mt-8 mb-2 mx-2 sm:mx-4 flex flex-col min-h-[calc(100vh-4rem)]">

        {/* Header Bar */}
        <header className="max-w-5xl mx-auto w-full flex justify-between items-center gap-3 bg-[#12081F] p-4 rounded-2xl border-4 border-[#0B0B0B]">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-display text-xl text-white block drop-shadow-[2px_2px_0px_#E62429] shrink-0">
              DESIGN-EVENT<span className="text-[#00E5D4]">.</span>
            </span>
            <span className="text-xs font-bold text-white/50 hidden sm:inline truncate">
              Poster Design — Round 1
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <span className="text-xs font-mono font-bold text-white bg-white/10 px-3 py-1.5 rounded-full border-2 border-white/20 whitespace-nowrap">
              {profile?.name} ({profile?.roll_number})
            </span>
            <button
              onClick={logout}
              className="text-xs font-bold text-white/60 hover:text-[#FF2D78] flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </header>

        {/* Main Preflight Dashboard Container */}
        <main className="max-w-5xl mx-auto w-full flex-grow flex flex-col justify-center py-6">
          <div className="relative">
            <div className="absolute -bottom-2 -left-2 w-full h-full bg-[#00E5D4] rounded-2xl" />
            <div className="absolute -top-2 -right-2 w-full h-full bg-[#FFD400] rounded-2xl" />

            <div className="relative p-6 sm:p-8 rounded-2xl bg-[#12081F] border-4 border-[#0B0B0B] space-y-8">

              {/* Section Title — spider-verse gradient banner */}
              <div className="-mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-2 px-6 sm:px-8 py-7 spiderverse-panel border-b-4 border-[#0B0B0B] relative overflow-hidden text-center rounded-t-xl">
                <div className="absolute inset-0 spiderverse-halftone" />
                <span className="relative z-10 inline-block text-sm font-extrabold uppercase tracking-wider text-[#0B0B0B] bg-white px-4 py-2 rounded-full border-2 border-[#0B0B0B]">
                  Competition Rules
                </span>
                <h1 className="relative z-10 font-display text-3xl sm:text-4xl text-white tracking-tight pt-3 drop-shadow-[2px_2px_0px_#E62429]">
                  ROUND 1 — POSTER DESIGN COMPETITION
                </h1>
                <p className="relative z-10 text-sm font-bold text-white/80 mt-2">
                  Read all instructions below carefully before launching your workspace.
                </p>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-white/5 border-2 border-white/20 rounded-2xl text-center -rotate-1">
                  <Clock size={26} className="mx-auto text-[#FF2D78] mb-2" />
                  <div className="font-display text-2xl text-white">25 MINUTES</div>
                  <span className="text-xs uppercase font-bold text-white/50">Timed Round</span>
                </div>

                <div className="p-5 bg-white/5 border-2 border-white/20 rounded-2xl text-center rotate-1">
                  <Target size={26} className="mx-auto text-[#FF2D78] mb-2" />
                  <div className="font-display text-2xl text-white">10 TASKS</div>
                  <span className="text-xs uppercase font-bold text-white/50">Layout Workspaces</span>
                </div>

                <div className="p-5 bg-white/5 border-2 border-white/20 rounded-2xl text-center -rotate-1">
                  <Award size={26} className="mx-auto text-[#FFD400] mb-2" />
                  <div className="font-display text-2xl text-white">100 POINTS</div>
                  <span className="text-xs uppercase font-bold text-white/50">Max Score</span>
                </div>

                <div className="p-5 bg-white/5 border-2 border-white/20 rounded-2xl text-center rotate-1">
                  <ShieldCheck size={26} className="mx-auto text-[#00E5D4] mb-2" />
                  <div className="font-display text-2xl text-white">TOP 30</div>
                  <span className="text-xs uppercase font-bold text-white/50">Advance to Round 2</span>
                </div>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-[#E62429]/10 border-2 border-[#E62429] text-[#FF6B72] text-xs font-bold">
                  {error}
                </div>
              )}

              {/* Guidelines Numbered Rows */}
              <div className="space-y-3">
                <h2 className="text-base font-extrabold uppercase tracking-wider text-white/80">
                  Competition Instructions
                </h2>

                {[
                  { num: '01', title: 'Read each task carefully', desc: 'Each task specifies exact position (X, Y), dimensions (W, H), and styling properties.' },
                  { num: '02', title: 'Use the design editor to match required layout', desc: 'Interact directly with the 800×600 pixel white canvas or use the Inspector panel.' },
                  { num: '03', title: 'Coordinates and dimensions matter', desc: 'Server evaluation scores your accuracy within a precise ±3px tolerance window.' },
                  { num: '04', title: 'Single final submission attempt', desc: 'Once submitted or when the 25-minute timer expires, your poster JSON is evaluated automatically.' },
                  { num: '05', title: 'The timer starts when you click Start Round', desc: 'Closing or refreshing your browser window will NOT pause the timer.' }
                ].map(step => (
                  <div key={step.num} className="p-5 bg-white/5 rounded-xl border-2 border-white/20 flex items-start gap-4">
                    <span className="w-10 h-10 rounded-lg bg-[#FF2D78] border-2 border-[#0B0B0B] text-white font-mono font-bold text-base flex items-center justify-center shrink-0">
                      {step.num}
                    </span>
                    <div>
                      <h3 className="text-lg font-extrabold text-white leading-snug">{step.title}</h3>
                      <p className="text-base text-white/60 mt-1.5 font-semibold leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Primary CTA */}
              <div className="pt-2 relative group">
                <div className="absolute -bottom-1.5 -left-1.5 w-full h-full bg-[#00E5D4] rounded-full" />
                <button
                  onClick={handleStartRound}
                  disabled={isStarting}
                  className="relative w-full py-4 halftone-btn disabled:opacity-50 text-[#0B0B0B] rounded-full font-display text-sm uppercase tracking-wider border-2 border-[#0B0B0B] transition-all cursor-pointer flex items-center justify-center gap-2 group-active:translate-x-[2px] group-active:translate-y-[2px]"
                >
                  {isStarting ? (
                    <span className="flex items-center justify-center gap-2 font-comic-body font-extrabold normal-case tracking-normal">
                      <span className="w-4 h-4 border-2 border-[#0B0B0B] border-t-transparent rounded-full animate-spin" />
                      Launching Challenge Timer...
                    </span>
                  ) : (
                    <>
                      <span>Start Round</span> <ArrowRight size={16} strokeWidth={3} />
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center text-xs text-[#0B0B0B]/60 font-bold uppercase tracking-wide">
          Participant Session Verified • Roll: {profile?.roll_number || 'Verified'}
        </footer>
      </div>

      {/* bottom dot strip */}
      <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-5 right-3 sm:right-5 h-2 dot-strip z-10" />
    </div>
  );
};

export default InstructionsPage;