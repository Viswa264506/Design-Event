import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { isSupabaseConfigured } from '../../services/supabase';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAdmin, loginAdmin, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate('/admin/dashboard');
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
    <div className="min-h-screen bg-[#0d0e12] text-gray-100 flex flex-col justify-center items-center font-sans relative px-4">
      {/* Background glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md p-8 rounded-2xl bg-gray-900/40 border border-gray-800 backdrop-blur-md shadow-2xl relative">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-indigo-500/20 mb-4">
            A
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Admin Portal</h2>
          <p className="text-sm text-gray-400 mt-1">Provide administrator credentials to access dashboard</p>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-6 p-4 rounded-xl bg-amber-900/20 border border-amber-500/30 text-amber-300 text-xs leading-normal">
            <span className="font-bold">Configuration Warning:</span> Supabase database credentials are missing. The app is running in offline mode. Please configure your environment variables in <code className="bg-amber-950 px-1 py-0.5 rounded text-[11px] font-mono">.env</code> to enable admin validation.
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Admin Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:outline-none focus:border-indigo-500 text-white placeholder-gray-600 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:outline-none focus:border-indigo-500 text-white placeholder-gray-600 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 disabled:from-indigo-700 disabled:to-indigo-900 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
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
      </div>
    </div>
  );
};

export default AdminLoginPage;
