import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { startParticipantRound } from '../../services/supabase';

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

      // Sync AuthContext profile
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
    <div className="min-h-screen bg-[#0d0e12] text-gray-100 flex flex-col justify-between font-sans px-6 py-8 relative">
      {/* Glow shapes */}
      <div className="absolute top-[-10%] left-[-15%] w-[450px] h-[450px] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-15%] w-[450px] h-[450px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="max-w-4xl mx-auto w-full flex justify-between items-center border-b border-gray-800 pb-6 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/10">
            D
          </div>
          <span className="font-bold text-lg tracking-wide text-white">
            DESIGN FEST 2026
          </span>
        </div>
        <button
          onClick={logout}
          className="text-sm font-semibold text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </header>

      {/* Main Body */}
      <main className="max-w-2xl mx-auto w-full flex-grow flex flex-col justify-center py-12 z-10">
        <div className="p-8 rounded-2xl bg-gray-900/40 border border-gray-800 backdrop-blur-md shadow-2xl">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Competition Instructions</h1>
            <p className="text-sm text-indigo-400">
              Welcome, <span className="font-semibold text-white">{profile?.name}</span> ({profile?.roll_number})
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6 text-gray-300 leading-relaxed text-sm">
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Time Limit & Lockout</h3>
                <p>You have exactly <span className="text-white font-semibold">25 minutes</span> to complete the challenge. The countdown starts as soon as you click the button below. Closing your browser or tab will <span className="text-amber-400">NOT pause the timer</span>.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Practical Tasks</h3>
                <p>There are <span className="text-white font-semibold">10 layout recreation tasks</span>. You will navigate them in order. Align shapes, adjust fonts, color codes, sizes, and position assets to match specifications exactly.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Automatic Scoring</h3>
                <p>Each task carries 10 points. Coordinates are measured on a virtual <span className="text-white font-semibold">800x600 px canvas</span>. Sizing and coordinates are scored automatically using a server-side tolerance window of <span className="text-white font-semibold">&plusmn;3px</span>.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                4
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Final Submission</h3>
                <p>Only your final submission is evaluated. You can submit only once. On submission or timer expiry, the workspace locks down immediately and scoring details will be generated.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-800 pt-6">
            <button
              onClick={handleStartRound}
              disabled={isStarting}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-indigo-700 disabled:to-purple-700 text-white rounded-xl font-bold text-base shadow-xl shadow-indigo-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              {isStarting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Initializing challenge timer...
                </span>
              ) : (
                'Start Round (Start 25-Minute Timer)'
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-600 text-xs">
        Event Administrator ID check: {profile?.id ? `Verified (${profile.id.substring(0,8)})` : 'Unverified'}
      </footer>
    </div>
  );
};

export default InstructionsPage;
