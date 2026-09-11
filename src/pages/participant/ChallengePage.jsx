import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { useHistory } from '../../hooks/useHistory';
import { useTimer } from '../../hooks/useTimer';
import { submitDesignService } from '../../services/supabase';
import { tasksData } from '../../data/tasks';

import DesignCanvas from '../../components/editor/DesignCanvas';
import Toolbar from '../../components/editor/Toolbar';
import PropertiesPanel from '../../components/editor/PropertiesPanel';
import TaskPanel from '../../components/editor/TaskPanel';
import { Clock, Send, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';

const ChallengePage = () => {
  const { profile, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks] = useState(tasksData);
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const activeTask = tasks[activeTaskIndex] || tasks[0];

  const [selectedId, setSelectedId] = useState(null);
  const [activeTool, setActiveTool] = useState('select');

  const [challengeState, setChallengeState] = useState(() => {
    const fallbackState = {};
    tasksData.forEach(task => {
      fallbackState[task.id] = task.public_config?.initialElements || [];
    });

    const saved = profile?.id ? localStorage.getItem(`design_event_elements_${profile.id}`) : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const merged = {};
        tasksData.forEach(task => {
          const savedElements = parsed?.[task.id];
          merged[task.id] = (Array.isArray(savedElements) && savedElements.length > 0)
            ? savedElements
            : fallbackState[task.id];
        });
        return merged;
      } catch (e) {
        console.error('Failed to parse elements cache:', e);
      }
    }

    return fallbackState;
  });

  const [taskCompletion, setTaskCompletion] = useState({});

  useEffect(() => {
    if (!profile?.id) return;
    const saved = localStorage.getItem(`design_event_elements_${profile.id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setChallengeState(prev => {
          const merged = {};
          let changed = false;
          tasksData.forEach(task => {
            const savedElements = parsed?.[task.id];
            const validSaved = (Array.isArray(savedElements) && savedElements.length > 0)
              ? savedElements
              : (task.public_config?.initialElements || []);
            merged[task.id] = validSaved;
            if (JSON.stringify(prev[task.id]) !== JSON.stringify(validSaved)) {
              changed = true;
            }
          });
          return changed ? merged : prev;
        });
      } catch (e) {
        console.error('Failed to restore saved elements:', e);
      }
    }
  }, [profile?.id]);

  useEffect(() => {
    if (profile?.id) {
      localStorage.setItem(`design_event_elements_${profile.id}`, JSON.stringify(challengeState));
    }

    const completion = {};
    tasks.forEach(task => {
      const savedTaskElements = challengeState[task.id];
      const current = (Array.isArray(savedTaskElements) && savedTaskElements.length > 0)
        ? savedTaskElements
        : (task.public_config?.initialElements || []);
      const initial = task.public_config?.initialElements || [];
      completion[task.id] = JSON.stringify(current) !== JSON.stringify(initial) && current.length > 0;
    });
    setTaskCompletion(completion);
  }, [challengeState, profile?.id, tasks]);

  const savedTaskElements = challengeState[activeTask.id];
  const initialTaskElements = (Array.isArray(savedTaskElements) && savedTaskElements.length > 0)
    ? savedTaskElements
    : (activeTask.public_config?.initialElements || []);

  const {
    state: currentElements,
    setState: setCurrentElements,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
  } = useHistory(initialTaskElements);

  useEffect(() => {
    setChallengeState(prev => {
      const existing = prev[activeTask.id] || [];
      if (currentElements.length === 0 && existing.length > 0) {
        return prev;
      }
      if (JSON.stringify(existing) === JSON.stringify(currentElements)) return prev;
      return {
        ...prev,
        [activeTask.id]: currentElements
      };
    });
  }, [currentElements, activeTask.id]);

  useEffect(() => {
    const savedNext = challengeState[activeTask.id];
    const nextElements = (Array.isArray(savedNext) && savedNext.length > 0)
      ? savedNext
      : (activeTask.public_config?.initialElements || []);
    resetHistory(nextElements);
    setSelectedId(null);
  }, [activeTaskIndex, activeTask.id, resetHistory]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        handleDeleteElement();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }

      if (e.key === 'v' || e.key === 'V') setActiveTool('select');
      if (e.key === 't' || e.key === 'T') handleAddElement('text');
      if (e.key === 'r' || e.key === 'R') handleAddElement('rectangle');
      if (e.key === 'o' || e.key === 'O') handleAddElement('circle');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, currentElements, undo, redo]);

  const handleAddElement = (type) => {
    const id = `${type}_${Date.now()}`;
    let newEl = {
      id,
      type,
      x: 350,
      y: 250,
      width: 100,
      height: 100,
      name: `New ${type}`,
    };

    if (type === 'text') {
      newEl = {
        ...newEl,
        width: 300,
        height: 60,
        text: 'Sample Text',
        fontSize: 20,
        fontWeight: 400,
        fontFamily: 'Inter',
        color: '#000000',
        align: 'left',
      };
    } else if (type === 'rectangle') {
      newEl = {
        ...newEl,
        backgroundColor: '#2563EB',
        borderRadius: 0,
      };
    } else if (type === 'circle') {
      newEl = {
        ...newEl,
        backgroundColor: '#16A34A',
      };
    } else if (type === 'image') {
      newEl = {
        ...newEl,
        width: 200,
        height: 150,
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60',
      };
    } else if (type === 'logo') {
      newEl = {
        ...newEl,
        type: 'rectangle',
        width: 120,
        height: 40,
        backgroundColor: '#2563EB',
        borderRadius: 8,
      };
    }

    const updated = [...currentElements, newEl];
    setCurrentElements(updated);
    setSelectedId(id);
  };

  const handleUpdateElement = (updatedEl) => {
    const updated = currentElements.map(el => (el.id === updatedEl.id ? updatedEl : el));
    setCurrentElements(updated);
  };

  const handleDeleteElement = () => {
    if (!selectedId) return;
    const updated = currentElements.filter(el => el.id !== selectedId);
    setCurrentElements(updated);
    setSelectedId(null);
  };

  const handleDuplicateElement = () => {
    if (!selectedId) return;
    const original = currentElements.find(el => el.id === selectedId);
    if (!original) return;

    const id = `${original.type}_${Date.now()}`;
    const duplicated = {
      ...original,
      id,
      x: Math.min(800 - original.width, original.x + 20),
      y: Math.min(600 - original.height, original.y + 20),
      name: `${original.name} Copy`
    };

    setCurrentElements([...currentElements, duplicated]);
    setSelectedId(id);
  };

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const sessionId = sessionStorage.getItem('design_event_session_id');

      // Construct immutable initial challenge state baseline for attempt evaluation
      const initialChallengeState = {};
      tasksData.forEach(task => {
        initialChallengeState[task.id] = task.public_config?.initialElements || [];
      });

      const { data, error } = await submitDesignService(challengeState, sessionId, initialChallengeState);
      if (error) throw error;

      if (data?.submissionId) {
        sessionStorage.setItem('design_event_last_submission_id', data.submissionId);
      }

      localStorage.removeItem(`design_event_elements_${profile.id}`);
      sessionStorage.removeItem('design_event_session_id');

      await refreshProfile();
      navigate('/result');
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || 'Submission failed. Please check network connection and try again.');
      setIsSubmitting(false);
    }
  };

  const handleTimerExpire = () => {
    console.log('Timer expired, auto-submitting current design...');
    handleFinalSubmit();
  };

  const { formatTime, timeRemaining } = useTimer(profile?.started_at, 25, handleTimerExpire);

  const isDangerTime = timeRemaining <= 60;
  const isWarningTime = timeRemaining <= 300 && !isDangerTime;

  const selectedElement = currentElements.find(el => el.id === selectedId);

  return (
    <div className="h-screen bg-slate-950 flex flex-col justify-between overflow-hidden text-slate-100 font-sans select-none">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');
        .font-sans { font-family: 'Inter', system-ui, sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* 1. TOP NAVBAR — sleek dark studio topbar */}
      <header className="h-16 px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-30 shrink-0 shadow-md">

        {/* Left Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20 ring-1 ring-white/10">
            <span className="text-white font-mono font-bold text-xs">DE</span>
          </div>
          <div>
            <span className="text-base font-bold tracking-tight block text-white">
              Design-Event Studio
            </span>
            <span className="text-[10px] text-slate-400 block font-medium -mt-0.5">Poster Design 2026 · Round 1</span>
          </div>
        </div>

        {/* Center Task & Timer Display */}
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono font-bold bg-slate-950 px-3.5 py-1.5 rounded-full border border-slate-800 text-slate-200">
            Task <strong className="text-blue-400">{String(activeTaskIndex + 1).padStart(2, '0')}</strong> / 10
          </div>

          {/* Timer Display */}
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border font-mono font-bold text-xs tracking-wider transition ${
            isDangerTime
              ? 'bg-red-500/20 border-red-500/40 text-red-400 animate-pulse'
              : isWarningTime
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
              : 'bg-slate-950 border-slate-800 text-slate-200'
          }`}>
            <Clock size={14} className={isDangerTime ? 'text-red-400' : 'text-blue-400'} />
            <span>{formatTime()}</span>
          </div>
        </div>

        {/* Right Actions & Status */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Autosaved</span>
          </div>

          <span className="hidden sm:inline-flex items-center px-3 py-1 bg-slate-950 border border-slate-800 rounded-full font-mono text-xs font-semibold text-slate-300">
            {profile?.roll_number || 'Participant'}
          </span>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-semibold text-white rounded-full transition-all shadow-md shadow-blue-600/25 cursor-pointer"
          >
            <Send size={13} /> Submit Round
          </button>

          <button
            onClick={logout}
            className="p-1.5 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full border border-slate-800 transition-colors cursor-pointer"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </header>

      {/* 2. MAIN EDITOR WORKSPACE */}
      <div className="flex-grow flex overflow-hidden relative">

        {/* Left Task Sidebar */}
        <TaskPanel
          tasks={tasks}
          activeTaskIndex={activeTaskIndex}
          setActiveTaskIndex={setActiveTaskIndex}
          taskCompletion={taskCompletion}
        />

        {/* Center Workspace */}
        <div className="flex-grow flex overflow-hidden relative">
          <Toolbar
            allowedTypes={activeTask.public_config.allowedTypes || []}
            onAddElement={handleAddElement}
            onDeleteSelected={handleDeleteElement}
            onDuplicateSelected={handleDuplicateElement}
            selectedId={selectedId}
            undo={undo}
            redo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
            activeTool={activeTool}
            setActiveTool={setActiveTool}
          />

          <DesignCanvas
            elements={currentElements}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            updateElements={setCurrentElements}
          />
        </div>

        {/* Right Inspector Panel */}
        <PropertiesPanel
          selectedElement={selectedElement}
          onUpdateElement={handleUpdateElement}
          elements={currentElements}
          onSelectElement={setSelectedId}
        />
      </div>

      {/* 3. CONFIRMATION SUBMIT MODAL */}
      {isSubmitModalOpen && (
        <div className="font-sans fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">

            <div className="px-6 pt-6 pb-5 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 size={20} className="text-blue-400" /> Submit your design?
              </h3>
            </div>

            <div className="p-6 space-y-5">
              <p className="text-sm leading-relaxed text-slate-300">
                You will not be able to edit your submission after submitting. All 10 poster workspaces will be evaluated server-side in real-time.
              </p>

              {submitError && (
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-400" />
                  <span className="text-xs font-medium text-red-300 leading-relaxed">{submitError}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsSubmitModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-xs font-semibold text-white rounded-xl transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Evaluating Precision...
                    </span>
                  ) : (
                    'Confirm Final Submission'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ChallengePage;