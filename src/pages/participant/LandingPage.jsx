import React from 'react';
import { ArrowRight } from 'lucide-react';

const LandingPage = () => {
  // Works standalone — no <Router> wrapper needed anywhere in the tree.
  const goToWorkspace = () => {
    window.location.href = '/login';
  };

  return (
    <div className="font-comic-body h-screen bg-[#F4EE2A] text-[#0B0B0B] relative overflow-hidden p-3 sm:p-5">

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
        .speed-rays {
          background: repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.08) 0deg 4deg, transparent 4deg 10deg);
        }
        .halftone-btn {
          background-color: #FFFFFF;
          background-image: radial-gradient(rgba(11,11,11,0.18) 1px, transparent 1px);
          background-size: 10px 10px;
          background-position: -2px -2px;
        }
        .halftone-btn span, .halftone-btn svg { position: relative; z-index: 1; }
        @keyframes floaty { 0%,100%{ transform: translateY(0) rotate(var(--r,0deg)); } 50%{ transform: translateY(-8px) rotate(var(--r,0deg)); } }
        .float-el { animation: floaty 4s ease-in-out infinite; }
      `}</style>

      {/* Outer layered neon border frame */}
      <div className="absolute inset-0 bg-[#F4EE2A] z-0" />
      <div className="absolute inset-3 sm:inset-5 border-[6px] border-[#E62429] rounded-sm z-0" />
      <div className="absolute inset-[18px] sm:inset-[26px] border-[6px] border-[#FF2D78] rounded-sm z-0" />
      <div className="absolute inset-[30px] sm:inset-[42px] border-[4px] border-[#00E5D4] rounded-sm z-0" />

      {/* top dot strip */}
      <div className="absolute top-3 sm:top-5 left-3 sm:left-5 right-3 sm:right-5 h-2 dot-strip-color z-10" />

      {/* content shell — fills the screen, no scroll */}
      <div className="relative z-10 h-full flex flex-col mt-8 mb-2 mx-2 sm:mx-4">

        

        {/* Main dark panel — header removed, hero now fills the whole panel */}
        <div className="bg-[#12081F] rounded-2xl border-4 border-[#0B0B0B] overflow-hidden flex-1 flex flex-col">

          {/* hero — single centered panel, taller now that header is gone */}
          <div className="flex-1 relative m-4 sm:m-6 rounded-xl overflow-hidden spiderverse-panel flex flex-col items-center justify-center text-center px-6">
            <div className="absolute inset-0 spiderverse-halftone" />
            <div className="absolute inset-0 speed-rays opacity-25" />

            <h1 className="relative z-10 font-display text-4xl sm:text-6xl lg:text-7xl text-white leading-[0.95] drop-shadow-[3px_3px_0px_#E62429]">
              POSTER DESIGN
            </h1>
            <span className="relative z-10 font-display text-xl sm:text-3xl text-[#00E5D4] tracking-wider mt-2">
              WORKSPACE
            </span>

            <div className="relative z-10 flex items-center gap-6 mt-6">
              <span className="font-display text-lg sm:text-2xl text-[#FF2D78]">10 TASKS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span className="font-display text-lg sm:text-2xl text-white/70">25 MIN ROUND</span>
            </div>

            <div className="relative z-10 mt-8 inline-block group cursor-pointer" onClick={goToWorkspace}>
              <div className="absolute -bottom-2 -left-2 w-full h-full bg-[#00E5D4] rounded-sm" />
              <div className="absolute -top-2 -right-2 w-full h-full bg-[#FFD400] rounded-sm" />
              <button className="relative z-10 halftone-btn px-8 py-4 text-[#0B0B0B] rounded-sm font-display text-base sm:text-lg uppercase tracking-wider border-2 border-[#0B0B0B] inline-flex items-center gap-2 group-hover:-translate-y-0.5 group-hover:-translate-x-0.5 transition-transform">
                <span>Enter Workspace</span> <ArrowRight size={18} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* bottom dot strip */}
      <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-5 right-3 sm:right-5 h-2 dot-strip z-10" />
    </div>
  );
};

export default LandingPage;