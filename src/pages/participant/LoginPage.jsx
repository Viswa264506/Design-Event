import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { isSupabaseConfigured } from '../../services/supabase';

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
        friendlyError = 'Please enter a valid registration roll number.';
      } else if (friendlyError.includes('Not registered')) {
        friendlyError = 'This roll number is not registered for this event.';
      } else if (friendlyError.includes('Wrong year')) {
        friendlyError = "This participant is not registered for this year's competition.";
      } else if (friendlyError.includes('Already active')) {
        friendlyError = 'This roll number is already active on another device.';
      } else if (friendlyError.includes('Already completed')) {
        friendlyError = 'You have already completed Round 1.';
      }
      setError(friendlyError);
    } else {
      navigate('/instructions');
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-gray-100 flex flex-col justify-center items-center font-sans relative px-4">
      {/* Glow shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md p-8 rounded-2xl bg-gray-900/40 border border-gray-800 backdrop-blur-md shadow-2xl relative">
        


        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-indigo-500/20 mb-4">
            D
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Participant Login</h2>
          <p className="text-sm text-gray-400 mt-1">Enter your details to register or rejoin the contest</p>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-6 p-4 rounded-xl bg-amber-900/20 border border-amber-500/30 text-amber-300 text-xs leading-normal">
            <span className="font-bold">Configuration Warning:</span> Supabase database credentials are missing. The app is running in offline mode. Please configure your environment variables in <code className="bg-amber-950 px-1 py-0.5 rounded text-[11px] font-mono">.env</code> to enable login and submissions.
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="rollNumber" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Registration Roll Number
            </label>
            <input
              id="rollNumber"
              type="text"
              placeholder="e.g., 22CS101"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:outline-none focus:border-indigo-500 text-white placeholder-gray-600 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-indigo-700 disabled:to-purple-700 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Logging in...
              </span>
            ) : (
              'Access Competition Area'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
