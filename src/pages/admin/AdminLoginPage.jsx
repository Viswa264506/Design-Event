import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { isSupabaseConfigured } from '../../services/supabase';
import { Eye, EyeOff, ArrowLeft, X } from 'lucide-react';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAdmin, loginAdmin, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/instructions');
      }
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password.');
      return;
    }

    setIsSubmitting(true);
    const { error: loginError } = await loginAdmin(email.trim(), password.trim());
    setIsSubmitting(false);

    if (loginError) {
      setError(loginError.message || 'Login failed. Only registered administrators may enter.');
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="font-comic-body min-h-screen bg-[#F3EEE7] text-[#111111] flex flex-col justify-center items-center relative px-4 overflow-hidden">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700&display=swap');
        .font-comic-body { font-family: 'Comic Neue', 'Comic Sans MS', cursive, sans-serif; }
        .font-display { font-family: 'Bangers', 'Archivo Black', cursive; letter-spacing: 0.03em; }
      `}</style>

      {/* Halftone dot background */}
      <div
        className="absolute inset-0 opacity-[0.2] pointer-events-none z-0"
        style={{ backgroundImage: 'radial-gradient(#111111 1.4px, transparent 1.4px)', backgroundSize: '18px 18px' }}
      />
      <svg className="absolute left-10 top-12 hidden sm:block z-0" width="34" height="34" viewBox="0 0 46 46" fill="none">
        <path d="M23 2 L27 18 L43 23 L27 28 L23 44 L19 28 L3 23 L19 18 Z" fill="#E11D2E" />
      </svg>

      <div className="relative z-10 w-full max-w-md">
        <div className="absolute inset-0 translate-x-3 translate-y-3 bg-[#E11D2E] rounded-2xl" />
        <div className="relative w-full p-8 rounded-2xl bg-[#111111] border-4 border-[#111111] shadow-none">

          <button
            type="button"
            onClick={() => navigate('/')}
            className="absolute top-4 right-4 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Exit to Landing Page"
          >
            <X size={18} />
          </button>

          <div className="flex flex-col items-center mb-8 text-center">
            <span className="font-display text-2xl tracking-wide text-[#E11D2E] mb-1">
              ADMIN PORTAL
            </span>
            <p className="text-sm text-white/60 mt-1 font-semibold">Provide administrator credentials to access dashboard</p>
          </div>

          {!isSupabaseConfigured && (
            <div className="mb-6 p-3.5 rounded-lg bg-[#FFC700]/10 border-2 border-[#FFC700]/40 text-[#FFC700] text-xs leading-relaxed font-medium">
              <span className="font-bold">Configuration Warning:</span> Supabase database credentials are missing. The app is running in offline mode. Please configure your environment variables in <code className="bg-black px-1 py-0.5 rounded text-[11px] font-mono">.env</code> to enable admin validation.
            </div>
          )}

          {error && (
            <div className="mb-6 p-3.5 rounded-lg bg-[#E11D2E]/10 border-2 border-[#E11D2E] text-[#ff8a94] text-sm font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-extrabold text-white/70 uppercase tracking-wider mb-2">
                Admin Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-[#1c1c1c] border-2 border-[#2a2a2a] rounded-lg focus:outline-none focus:border-[#E11D2E] text-white placeholder-white/30 font-mono font-bold transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-extrabold text-white/70 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 pr-12 bg-[#1c1c1c] border-2 border-[#2a2a2a] rounded-lg focus:outline-none focus:border-[#E11D2E] text-white placeholder-white/30 font-mono font-bold transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors cursor-pointer p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-[#E11D2E] hover:bg-[#c8121f] disabled:opacity-50 text-white rounded-full font-extrabold text-xs uppercase tracking-wider border-2 border-white/10 shadow-[3px_3px_0px_0px_#FFC700] hover:shadow-[1px_1px_0px_0px_#FFC700] transition-all cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Verifying Credentials...
                </span>
              ) : (
                'Enter Admin Panel'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white/50 hover:text-[#E11D2E] transition cursor-pointer"
            >
              <ArrowLeft size={14} /> Exit to Landing Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;