import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { isSupabaseConfigured } from '../../services/supabase';
import { Shield, Clock, ArrowRight, ArrowLeft, X } from 'lucide-react';

const LoginPage = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAdmin, loginParticipant, logout, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in as participant
  useEffect(() => {
    if (!loading && user && !isAdmin) {
      navigate('/instructions');
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!rollNumber.trim()) {
      setError('Please enter your registration Roll Number.');
      return;
    }

    setIsSubmitting(true);
    const { error: loginError } = await loginParticipant(rollNumber.trim());
    setIsSubmitting(false);

    if (loginError) {
      let friendlyError = loginError.message || 'Login failed. Please check your credentials or network connection.';
      if (friendlyError.includes('Invalid roll number')) {
        friendlyError = 'Please enter a valid registration Roll Number.';
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
    <div className="font-comic-body min-h-screen bg-[#F4EE2A] text-[#0B0B0B] flex flex-col justify-center items-center px-3 sm:px-5 py-6 relative overflow-hidden">

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

      {/* Main Card */}
      <div className="w-full max-w-md relative z-10 mt-6">
        {/* hard offset shadow blocks behind card, comic-panel style */}
        <div className="absolute -bottom-2 -left-2 w-full h-full bg-[#00E5D4] rounded-2xl" />
        <div className="absolute -top-2 -right-2 w-full h-full bg-[#FFD400] rounded-2xl" />

        <div className="relative bg-[#12081F] border-4 border-[#0B0B0B] rounded-2xl overflow-hidden">

          {/* Spider-verse gradient header panel */}
          <div className="spiderverse-panel border-b-4 border-[#0B0B0B] px-8 pt-7 pb-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 spiderverse-halftone" />
            <button
              type="button"
              onClick={() => navigate('/')}
              className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full bg-[#0B0B0B] hover:bg-white text-white hover:text-[#0B0B0B] font-extrabold text-xs flex items-center justify-center transition border-2 border-white/30 cursor-pointer"
              title="Exit to Landing Page"
            >
              <X size={14} />
            </button>
            <span className="relative z-10 font-display text-2xl text-white block drop-shadow-[2px_2px_0px_#E62429]">
              DESIGN-EVENT<span className="text-[#00E5D4]">.</span>
            </span>
            <p className="relative z-10 text-[10px] font-extrabold text-white/85 mt-1.5 tracking-widest uppercase">
              Poster Design Competition
            </p>
          </div>

          <div className="px-8 pt-7 pb-8">

            <h2 className="font-display text-2xl text-white text-center mb-6 leading-tight">
              ENTER ROUND 1
            </h2>

            {!isSupabaseConfigured && (
              <div className="mb-5 p-3.5 rounded-lg bg-[#FFD400]/10 border-2 border-[#FFD400] text-[#FFD400] text-xs leading-relaxed font-bold">
                Configuration Warning: Database credentials missing. Operating in demonstration mode.
              </div>
            )}

            {error && (
              <div className="mb-5 p-3.5 rounded-lg bg-[#E62429]/10 border-2 border-[#E62429] text-[#FF6B72] text-xs font-bold leading-relaxed">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="rollNumber" className="block text-xs font-extrabold text-white/80 uppercase tracking-wider mb-2">
                  Registration Roll Number
                </label>
                <input
                  id="rollNumber"
                  type="text"
                  placeholder="e.g. 23IT001"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  disabled={isSubmitting}
                  autoFocus
                  className="w-full px-4 py-3 bg-white/95 border-2 border-[#0B0B0B] rounded-lg focus:border-[#00E5D4] focus:ring-2 focus:ring-[#00E5D4]/30 text-sm text-[#0B0B0B] placeholder-[#9CA3AF] font-mono font-bold transition-all"
                />
              </div>

              <div className="relative group">
                <div className="absolute -bottom-1.5 -left-1.5 w-full h-full bg-[#00E5D4] rounded-full" />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative w-full py-3.5 px-4 halftone-btn disabled:opacity-50 text-[#0B0B0B] rounded-full font-display text-sm uppercase tracking-wider border-2 border-[#0B0B0B] transition-all cursor-pointer flex items-center justify-center gap-2 group-active:translate-x-[2px] group-active:translate-y-[2px]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2 font-comic-body font-extrabold normal-case tracking-normal">
                      <span className="w-4 h-4 border-2 border-[#0B0B0B] border-t-transparent rounded-full animate-spin" />
                      Connecting Workspace...
                    </span>
                  ) : (
                    <>
                      <span>Enter Competition</span> <ArrowRight size={16} strokeWidth={3} />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer Meta Specs — badge style */}
            <div className="mt-7 pt-5 border-t-2 border-dashed border-white/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/15 rounded-full px-3 py-1.5 font-bold text-white/85">
                <Clock size={13} className="text-[#00E5D4]" />
                <span>25 Min</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/15 rounded-full px-3 py-1.5 font-bold text-white/85">
                <Shield size={13} className="text-[#FF2D78]" />
                <span>2nd & 3rd Year</span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white/60 hover:text-[#FF2D78] transition cursor-pointer"
              >
                <ArrowLeft size={14} /> Exit to Landing Page
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

export default LoginPage;