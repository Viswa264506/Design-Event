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
import { Clock, Send, LogOut, CheckCircle2 } from 'lucide-react';

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
    <div className="h-screen bg-[#F5F7FB] flex flex-col justify-between overflow-hidden text-[#111827] font-sans select-none">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Comic+Neue:wght@400;700&display=swap');
        .font-comic-body { font-family: 'Comic Neue', 'Comic Sans MS', cursive, sans-serif; }
        .font-display { font-family: 'Bangers', 'Archivo Black', cursive; letter-spacing: 0.03em; }
        .halftone-btn {
          background-color: #FFFFFF;
          background-image: radial-gradient(rgba(11,11,11,0.18) 1px, transparent 1px);
          background-size: 10px 10px;
          background-position: -2px -2px;
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
      `}</style>

      {/* 1. TOP NAVBAR — matches LoginPage / InstructionsPage comic theme */}
      <header className="font-comic-body h-16 px-6 bg-[#F3EEE7] border-b-2 border-[#111111] flex items-center justify-between z-30 shrink-0">

        {/* Left Brand */}
        <div className="flex items-center gap-4">
          <div>
            <span className="font-display text-lg sm:text-xl tracking-wide text-[#E11D2E] block">
              DESIGN-EVENT<span className="text-[#111111]">.</span>
            </span>
            <span className="text-[10px] text-[#6B7280] block font-bold -mt-0.5">Poster Design 2026 • Round 1</span>
          </div>
        </div>

        {/* Center Task & Timer Display */}
        <div className="flex items-center gap-3">
          <div className="text-xs sm:text-sm font-mono font-extrabold text-[#111827] bg-white px-3.5 py-1.5 rounded-full border-2 border-[#111111]">
            Task <strong className="text-[#E11D2E]">{String(activeTaskIndex + 1).padStart(2, '0')}</strong> / 10
          </div>

          {/* Timer Display */}
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-[#111111] font-mono font-extrabold text-xs sm:text-sm tracking-wider transition ${
            isDangerTime
              ? 'bg-[#E11D2E] text-white animate-pulse'
              : isWarningTime
              ? 'bg-[#FFC700] text-[#111111]'
              : 'bg-white text-[#111827]'
          }`}>
            <Clock size={14} />
            <span>{formatTime()}</span>
          </div>
        </div>

        {/* Right Actions & Status */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-extrabold text-[#16A34A]">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span>Saved</span>
          </div>

          <span className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border-2 border-[#111111] text-xs sm:text-sm font-extrabold text-[#111827] whitespace-nowrap">
            {profile?.roll_number || 'Participant'}
          </span>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#E11D2E] hover:bg-[#c8121f] text-xs sm:text-sm font-extrabold text-white rounded-full border-2 border-[#111111] transition-all cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
          >
            <Send size={13} /> Submit Round
          </button>

          <button
            onClick={logout}
            className="p-2 bg-white text-[#6B7280] hover:text-[#E11D2E] hover:bg-[#F3EEE7] rounded-full border-2 border-[#111111] transition cursor-pointer"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* 2. MAIN EDITOR WORKSPACE — unchanged for editing precision/usability */}
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

      {/* 3. CONFIRMATION SUBMIT MODAL — light comic theme, matches other pages */}
      {isSubmitModalOpen && (
        <div className="font-comic-body fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="relative w-full max-w-md">
            <div className="absolute -bottom-2 -left-2 w-full h-full bg-[#00E5D4] rounded-2xl" />
            <div className="absolute -top-2 -right-2 w-full h-full bg-[#FFC700] rounded-2xl" />
            <div className="relative rounded-2xl bg-white border-4 border-[#111111] overflow-hidden">

              <div className="bg-[#F3EEE7] px-6 pt-6 pb-5 border-b-2 border-[#111111]">
                <h3 className="font-display text-2xl text-[#111111] flex items-center gap-2">
                  <CheckCircle2 size={22} className="text-[#E11D2E]" /> Submit your design?
                </h3>
              </div>

              <div className="p-6 space-y-5">
                <p className="text-[#374151] text-sm leading-relaxed font-semibold">
                  You will not be able to edit your submission after submitting. All 10 poster workspaces will be evaluated server-side.
                </p>

                {submitError && (
                  <div className="p-3.5 rounded-xl bg-[#E11D2E]/10 border-2 border-[#E11D2E] text-[#c8121f] text-xs font-bold">
                    {submitError}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setIsSubmitModalOpen(false)}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-extrabold text-[#6B7280] hover:text-[#111111] bg-transparent hover:bg-[#F3EEE7] rounded-full transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 bg-[#E11D2E] hover:bg-[#c8121f] disabled:opacity-50 text-sm font-extrabold uppercase tracking-wide text-white rounded-full border-2 border-[#111111] shadow-[3px_3px_0px_0px_#111111] hover:shadow-[1px_1px_0px_0px_#111111] transition-all cursor-pointer flex items-center gap-2 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2 normal-case tracking-normal">
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Evaluating...
                      </span>
                    ) : (
                      'Submit Design'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ChallengePage;