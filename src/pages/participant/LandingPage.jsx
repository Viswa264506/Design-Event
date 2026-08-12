import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Clock, Award, Terminal } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#111827] flex flex-col justify-between font-sans select-none relative overflow-hidden">
      
      {/* Background Top Blue Accent */}
      <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-[#EFF6FF] to-transparent pointer-events-none" />

      {/* Top White Header */}
      <header className="px-8 py-4 border-b border-[#E5E7EB] bg-white/90 backdrop-blur-xl flex justify-between items-center z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#2563EB] rounded-xl flex items-center justify-center font-extrabold text-white shadow-md shadow-[#2563EB]/20">
            <Sparkles size={16} />
          </div>
          <div>
            <span className="font-black text-sm tracking-tight text-[#111827] uppercase block">
              DESIGN-EVENT
            </span>
            <span className="text-[11px] font-semibold text-[#6B7280]">
              Poster Design Competition Platform
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-bold text-white rounded-xl shadow-md shadow-[#2563EB]/20 transition cursor-pointer flex items-center gap-1.5"
        >
          Participant Login <ArrowRight size={14} />
        </button>
      </header>

      {/* Main Professional Entry Workspace Container */}
      <main className="max-w-3xl mx-auto px-6 py-16 flex flex-col items-center justify-center flex-grow z-10 text-center space-y-8">
        
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-[#EFF6FF] px-3.5 py-1 rounded-full border border-[#2563EB]/20">
            Round 1 — Poster Design Competition
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111827] tracking-tight leading-tight">
            Poster Design Competition Workspace
          </h1>

          <p className="text-xs sm:text-sm text-[#6B7280] max-w-xl mx-auto leading-relaxed font-semibold">
            Welcome to Round 1. Perform 10 interactive poster layout tasks in our browser-based design workspace engine with automated real-time evaluation.
          </p>
        </div>

        {/* Specs Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
          <div className="p-4 bg-white border border-[#E5E7EB] rounded-2xl text-center space-y-1 shadow-sm">
            <Clock size={20} className="mx-auto text-[#2563EB]" />
            <div className="text-xl font-extrabold text-[#111827]">25 MIN</div>
            <span className="text-[10px] uppercase font-bold text-[#6B7280]">Timed Round</span>
          </div>

          <div className="p-4 bg-white border border-[#E5E7EB] rounded-2xl text-center space-y-1 shadow-sm">
            <Terminal size={20} className="mx-auto text-[#2563EB]" />
            <div className="text-xl font-extrabold text-[#111827]">10 TASKS</div>
            <span className="text-[10px] uppercase font-bold text-[#6B7280]">Layout Workspaces</span>
          </div>

          <div className="p-4 bg-white border border-[#E5E7EB] rounded-2xl text-center space-y-1 shadow-sm">
            <Award size={20} className="mx-auto text-[#2563EB]" />
            <div className="text-xl font-extrabold text-[#111827]">100 PTS</div>
            <span className="text-[10px] uppercase font-bold text-[#6B7280]">Max Score</span>
          </div>

          <div className="p-4 bg-white border border-[#E5E7EB] rounded-2xl text-center space-y-1 shadow-sm">
            <ShieldCheck size={20} className="mx-auto text-[#16A34A]" />
            <div className="text-xl font-extrabold text-[#111827]">3rd YEAR</div>
            <span className="text-[10px] uppercase font-bold text-[#6B7280]">65 Participants</span>
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => navigate('/login')}
          className="px-8 py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#2563EB]/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center gap-2"
        >
          Enter Competition Workspace <ArrowRight size={16} />
        </button>

      </main>

      {/* Footer */}
      <footer className="py-5 text-center text-xs text-[#6B7280] font-medium border-t border-[#E5E7EB] bg-white z-10">
        Design-Event • 3rd Year Poster Competition Platform
      </footer>

    </div>
  );
};

export default LandingPage;
