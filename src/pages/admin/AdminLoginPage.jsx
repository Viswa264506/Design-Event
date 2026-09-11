import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { isSupabaseConfigured } from '../../services/supabase';
import { Eye, EyeOff, ArrowLeft, ShieldCheck, AlertTriangle, Lock, Mail, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col justify-center items-center relative px-4 overflow-hidden font-sans">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .font-sans { font-family: 'Inter', system-ui, sans-serif; }
      `}</style>

      {/* Ambient background glow & grid lines */}
      <div className="absolute -top-40 -left-40 w-[36rem] h-[36rem] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[36rem] h-[36rem] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-dark opacity-30 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">

        <button
          type="button"
          onClick={() => navigate('/')}
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft size={15} /> Back to Participant Portal
        </button>

        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <ShieldCheck size={24} className="text-white" strokeWidth={2.2} />
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-[10px] font-mono font-bold text-indigo-400 mb-2">
              <Sparkles size={11} /> RESTRICTED CONSOLE
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">Administrator Sign In</h1>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Enter your administrative credentials to manage competition status and live leaderboards.
            </p>
          </div>

          <div className="px-8 pt-6 pb-8">

            {!isSupabaseConfigured && (
              <div className="mb-5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs leading-relaxed flex gap-3">
                <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-400" />
                <span>
                  <strong className="font-semibold text-amber-200">Demo Mode Active:</strong> Supabase credentials not detected. Enter any email/password to enter admin preview.
                </span>
              </div>
            )}

            {error && (
              <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="email"
                    type="email"
                    placeholder="admin@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-white placeholder-slate-600 text-xs font-medium transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-11 py-3 bg-slate-950/80 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 text-white placeholder-slate-600 text-xs font-medium transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 text-white rounded-xl font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Verifying Credentials...
                  </span>
                ) : (
                  'Sign In to Console'
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6 font-mono">
          Design-Event Administrative Control Center
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;