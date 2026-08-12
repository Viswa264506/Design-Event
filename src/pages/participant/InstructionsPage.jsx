import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { startParticipantRound } from '../../services/supabase';
import { Sparkles, Clock, Target, Award, LogOut, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

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
    <div className="min-h-screen bg-[#F5F7FB] text-[#111827] flex flex-col justify-between font-sans px-6 py-8 relative select-none">
      
      {/* Header Bar */}
      <header className="max-w-4xl mx-auto w-full flex justify-between items-center bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#2563EB] rounded-xl flex items-center justify-center font-extrabold text-white shadow-md shadow-[#2563EB]/20">
            <Sparkles size={18} />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-[#111827] uppercase block">
              DESIGN-EVENT
            </span>
            <span className="text-xs font-semibold text-[#6B7280]">
              Poster Design — Round 1
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-mono font-bold text-[#2563EB] bg-[#EFF6FF] px-3 py-1.5 rounded-xl border border-[#2563EB]/20">
            {profile?.name} ({profile?.roll_number})
          </span>
          <button
            onClick={logout}
            className="text-xs font-semibold text-[#6B7280] hover:text-red-600 flex items-center gap-1.5 transition cursor-pointer"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </header>

      {/* Main Preflight Dashboard Container */}
      <main className="max-w-4xl mx-auto w-full flex-grow flex flex-col justify-center py-8 z-10">
        <div className="p-8 rounded-2xl bg-white border border-[#E5E7EB] shadow-xl space-y-8">
          
          {/* Section Title */}
          <div className="border-b border-[#E5E7EB] pb-6 space-y-1 text-center">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-3.5 py-1 rounded-full border border-[#2563EB]/20">
              Competition Rules
            </span>
            <h1 className="text-2xl font-black text-[#111827] tracking-tight pt-2">
              ROUND 1 — POSTER DESIGN COMPETITION
            </h1>
            <p className="text-xs font-semibold text-[#6B7280]">
              Read all instructions below carefully before launching your workspace.
            </p>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-[#F8FAFF] border border-[#E5E7EB] rounded-2xl text-center">
              <Clock size={20} className="mx-auto text-[#2563EB] mb-1.5" />
              <div className="text-xl font-extrabold text-[#111827]">25 MINUTES</div>
              <span className="text-[10px] uppercase font-bold text-[#6B7280]">Timed Round</span>
            </div>

            <div className="p-4 bg-[#F8FAFF] border border-[#E5E7EB] rounded-2xl text-center">
              <Target size={20} className="mx-auto text-[#2563EB] mb-1.5" />
              <div className="text-xl font-extrabold text-[#111827]">10 TASKS</div>
              <span className="text-[10px] uppercase font-bold text-[#6B7280]">Layout Workspaces</span>
            </div>

            <div className="p-4 bg-[#F8FAFF] border border-[#E5E7EB] rounded-2xl text-center">
              <Award size={20} className="mx-auto text-[#2563EB] mb-1.5" />
              <div className="text-xl font-extrabold text-[#111827]">100 POINTS</div>
              <span className="text-[10px] uppercase font-bold text-[#6B7280]">Max Score</span>
            </div>

            <div className="p-4 bg-[#F8FAFF] border border-[#E5E7EB] rounded-2xl text-center">
              <ShieldCheck size={20} className="mx-auto text-[#16A34A] mb-1.5" />
              <div className="text-xl font-extrabold text-[#111827]">TOP 30</div>
              <span className="text-[10px] uppercase font-bold text-[#6B7280]">Advance to Round 2</span>
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Guidelines Numbered Rows */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#374151]">
              Competition Instructions
            </h2>

            {[
              { num: '01', title: 'Read each task carefully', desc: 'Each task specifies exact position (X, Y), dimensions (W, H), and styling properties.' },
              { num: '02', title: 'Use the design editor to match required layout', desc: 'Interact directly with the 800×600 pixel white canvas or use the Inspector panel.' },
              { num: '03', title: 'Coordinates and dimensions matter', desc: 'Server evaluation scores your accuracy within a precise ±3px tolerance window.' },
              { num: '04', title: 'Single final submission attempt', desc: 'Once submitted or when the 25-minute timer expires, your poster JSON is evaluated automatically.' },
              { num: '05', title: 'The timer starts when you click Start Round', desc: 'Closing or refreshing your browser window will NOT pause the timer.' }
            ].map(step => (
              <div key={step.num} className="p-4 bg-[#F8FAFF] rounded-xl border border-[#E5E7EB] flex items-start gap-4">
                <span className="w-7 h-7 rounded-lg bg-[#2563EB] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                  {step.num}
                </span>
                <div>
                  <h3 className="text-xs font-bold text-[#111827]">{step.title}</h3>
                  <p className="text-xs text-[#6B7280] mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Primary Blue CTA */}
          <div className="pt-2">
            <button
              onClick={handleStartRound}
              disabled={isStarting}
              className="w-full py-4 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#2563EB]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isStarting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Launching Challenge Timer...
                </span>
              ) : (
                <>
                  Start Round <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-[#6B7280] font-medium">
        Participant Session Verified • Roll: {profile?.roll_number || '274001'}
      </footer>
    </div>
  );
};

export default InstructionsPage;
