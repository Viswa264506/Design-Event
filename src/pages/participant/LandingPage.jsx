import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0d0e12] text-gray-100 flex flex-col justify-between font-sans overflow-hidden relative">
      {/* Decorative gradient glowing spheres */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="px-8 py-6 flex justify-between items-center border-b border-gray-800 backdrop-blur-md bg-[#0d0e12]/50 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-indigo-500/20">
            D
          </div>
          <span className="font-bold text-xl tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            DESIGN FEST 2026
          </span>
        </div>
      </header>

      {/* Hero section */}
      <main className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center text-center justify-center flex-grow z-10">
        <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-gray-800 bg-gray-900/60 text-indigo-400 mb-6 animate-pulse">
          Online Design Competition
        </span>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          Showcase Your <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Creative Edge
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed">
          Welcome to Round 1 of the Poster Design Competition. Test your precision, alignment, and formatting skills in our custom browser-based design editor.
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl w-full mb-12">
          <div className="p-4 rounded-2xl bg-gray-900/30 border border-gray-800 backdrop-blur-sm">
            <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">Duration</h3>
            <p className="text-2xl font-bold text-white">25 Mins</p>
          </div>
          <div className="p-4 rounded-2xl bg-gray-900/30 border border-gray-800 backdrop-blur-sm">
            <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Tasks</h3>
            <p className="text-2xl font-bold text-white">10 Tasks</p>
          </div>
          <div className="p-4 rounded-2xl bg-gray-900/30 border border-gray-800 backdrop-blur-sm">
            <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">Max Marks</h3>
            <p className="text-2xl font-bold text-white">100 Pts</p>
          </div>
          <div className="p-4 rounded-2xl bg-gray-900/30 border border-gray-800 backdrop-blur-sm">
            <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-1">Target Pool</h3>
            <p className="text-2xl font-bold text-white">Top 30</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold text-lg shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          Enter Competition Area
        </button>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-600 text-sm border-t border-gray-900 z-10">
        &copy; 2026 Department of Computer Science. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
