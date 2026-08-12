import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { isSupabaseConfigured } from '../../services/supabase';
import { Sparkles, Shield, Clock, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, loginParticipant, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/instructions');
    }
  }, [user, loading, navigate]);

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
      if (friendlyError.includes('Invalid roll number') || friendlyError.includes('Outside allowed range')) {
        friendlyError = 'Please enter a valid registration roll number (274001–274065).';
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
    <div className="min-h-screen bg-[#F5F7FB] text-[#111827] flex flex-col justify-center items-center font-sans px-4 select-none relative overflow-hidden">
      
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#EFF6FF] to-transparent pointer-events-none" />

      {/* Main Centered White Auth Card */}
      <div className="w-full max-w-md p-8 rounded-2xl bg-white border border-[#E5E7EB] shadow-xl relative z-10">
        
        {/* Brand & Workspace Title */}
        <div className="flex flex-col items-center mb-8 text-center space-y-3">
          <div className="w-12 h-12 bg-[#2563EB] rounded-2xl flex items-center justify-center font-extrabold text-xl text-white shadow-lg shadow-[#2563EB]/25">
            <Sparkles size={22} />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#111827] tracking-tight uppercase">
              DESIGN-EVENT
            </h1>
            <p className="text-xs font-bold text-[#6B7280] mt-0.5 tracking-wider uppercase">
              Poster Design Competition
            </p>
          </div>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs leading-relaxed font-medium">
            <span className="font-bold">Configuration Warning:</span> Database credentials missing. Operating in demonstration mode.
          </div>
        )}

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="rollNumber" className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-2">
              Registration Roll Number
            </label>
            <input
              id="rollNumber"
              type="text"
              placeholder="e.g. 274001"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              disabled={isSubmitting}
              autoFocus
              className="w-full px-4 py-3 bg-[#F8FAFF] border border-[#E5E7EB] rounded-xl focus:border-[#2563EB] text-sm text-[#111827] placeholder-[#9CA3AF] font-mono font-bold transition-all shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#2563EB]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Connecting Workspace...
              </span>
            ) : (
              <>
                Enter Competition <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Footer Meta Specs */}
        <div className="mt-8 pt-6 border-t border-[#E5E7EB] flex items-center justify-between text-xs text-[#6B7280] font-semibold">
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-[#2563EB]" />
            <span>Round 1 • 25 Minutes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield size={14} className="text-[#16A34A]" />
            <span>3rd Year Only</span>
          </div>
        </div>

      </div>

      <footer className="mt-8 text-xs text-[#6B7280] font-medium">
        Design-Event • Poster Design Competition Workspace
      </footer>
    </div>
  );
};

export default LoginPage;
