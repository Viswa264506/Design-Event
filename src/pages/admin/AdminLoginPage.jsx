import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { isSupabaseConfigured } from '../../services/supabase';
import { Eye, EyeOff, ArrowLeft, ShieldCheck, AlertTriangle, Lock, Mail } from 'lucide-react';

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
    <div className="min-h-screen bg-[#F5F6FA] text-[#111827] flex flex-col justify-center items-center relative px-4 overflow-hidden font-sans">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .font-sans { font-family: 'Inter', system-ui, sans-serif; }
      `}</style>

      {/* Ambient background glow */}
      <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[32rem] h-[32rem] bg-blue-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#111827 1px, transparent 1px), linear-gradient(90deg, #111827 1px, transparent 1px)', backgroundSize: '48px 48px' }}
      />

      <div className="relative z-10 w-full max-w-md">

        <button
          type="button"
          onClick={() => navigate('/')}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#6B7280] hover:text-[#111827] transition cursor-pointer"
        >
          <ArrowLeft size={15} /> Back to participant login
        </button>

        <div className="rounded-2xl bg-white border border-[#E5E7EB] shadow-xl shadow-black/[0.04] overflow-hidden">

          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-[#F1F1F1]">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
              <ShieldCheck size={22} className="text-white" strokeWidth={2.2} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#111827]">Admin Console</h1>
            <p className="text-sm text-[#6B7280] mt-1 leading-relaxed">
              Sign in with your administrator credentials to manage Round 1.
            </p>
          </div>

          <div className="px-8 pt-6 pb-8">

            {!isSupabaseConfigured && (
              <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs leading-relaxed flex gap-2.5">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>
                  <span className="font-semibold">Configuration warning —</span> Supabase credentials are missing. Running in offline mode. Configure <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px] font-mono">.env</code> to enable admin validation.
                </span>
              </div>
            )}

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    id="email"
                    type="email"
                    placeholder="admin@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-indigo-400 focus:bg-white text-[#111827] placeholder-[#9CA3AF] text-sm font-medium transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-11 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-indigo-400 focus:bg-white text-[#111827] placeholder-[#9CA3AF] text-sm font-medium transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151] transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 mt-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 disabled:opacity-50 text-white rounded-xl font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Verifying credentials...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-[#9CA3AF] mt-6 font-medium">
          Restricted access — authorized event administrators only.
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;