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

      {/* 1. TOP COMIC-STYLE APPLICATION BAR (workspace area below stays clean for editing) */}
      <header className="h-16 px-5 bg-[#12081F] border-b-4 border-[#0B0B0B] flex items-center justify-between z-30">

        {/* Left Brand */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <span className="font-display text-lg tracking-wide text-white drop-shadow-[1.5px_1.5px_0px_#E62429]">
              DESIGN-EVENT<span className="text-[#00E5D4]">.</span>
            </span>
          </div>

          <div className="h-5 w-[2px] bg-white/15" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-white/70">Poster Design — Round 1</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white text-[#FF2D78] border-2 border-[#0B0B0B]">
              Round 1 Workspace
            </span>
          </div>
        </div>

        {/* Center Task & Timer Display */}
        <div className="flex items-center gap-4">
          <div className="text-xs font-mono font-extrabold text-white bg-white/10 px-3.5 py-1.5 rounded-full border-2 border-white/20">
            Task <strong className="text-[#FF2D78]">{String(activeTaskIndex + 1).padStart(2, '0')}</strong> / 10
          </div>

          {/* Timer Display */}
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border-2 font-mono font-extrabold text-xs tracking-wider transition ${
            isDangerTime
              ? 'bg-[#E62429] text-white border-[#0B0B0B] animate-pulse'
              : isWarningTime
              ? 'bg-[#FFD400] text-[#0B0B0B] border-[#0B0B0B]'
              : 'bg-white/10 text-white border-white/20'
          }`}>
            <Clock size={14} />
            <span>{formatTime()}</span>
          </div>
        </div>

        {/* Right Actions & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#00E5D4]">
            <span className="w-2 h-2 rounded-full bg-[#00E5D4] animate-pulse" />
            <span>Saved</span>
          </div>

          <div className="h-5 w-[2px] bg-white/15" />

          <div className="text-xs font-mono font-extrabold text-white bg-white/10 px-3 py-1.5 rounded-full border-2 border-white/20">
            {profile?.roll_number || 'Participant'}
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 halftone-btn text-xs font-extrabold text-[#0B0B0B] rounded-full border-2 border-[#0B0B0B] transition-all cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
          >
            <Send size={13} /> Submit Round
          </button>

          <button
            onClick={logout}
            className="p-1.5 text-white/60 hover:text-[#FF2D78] hover:bg-white/10 rounded-full border-2 border-transparent hover:border-white/20 transition cursor-pointer"
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

      {/* 3. CONFIRMATION SUBMIT MODAL — comic style */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="relative w-full max-w-md">
            <div className="absolute -bottom-2 -left-2 w-full h-full bg-[#00E5D4] rounded-2xl" />
            <div className="absolute -top-2 -right-2 w-full h-full bg-[#FFD400] rounded-2xl" />
            <div className="relative rounded-2xl bg-[#12081F] border-4 border-[#0B0B0B] overflow-hidden">

              <div className="spiderverse-panel px-6 pt-6 pb-5 border-b-4 border-[#0B0B0B] relative overflow-hidden">
                <div className="absolute inset-0 spiderverse-halftone" />
                <h3 className="relative z-10 font-display text-2xl text-white flex items-center gap-2 drop-shadow-[2px_2px_0px_#E62429]">
                  <CheckCircle2 size={22} /> Submit your design?
                </h3>
              </div>

              <div className="p-6 space-y-5">
                <p className="text-white/70 text-xs leading-relaxed font-bold">
                  You will not be able to edit your submission after submitting. All 10 poster workspaces will be evaluated server-side.
                </p>

                {submitError && (
                  <div className="p-3.5 rounded-xl bg-[#E62429]/10 border-2 border-[#E62429] text-[#FF6B72] text-xs font-bold">
                    {submitError}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setIsSubmitModalOpen(false)}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-xs font-extrabold text-white/60 hover:text-white bg-transparent hover:bg-white/10 rounded-full transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 halftone-btn disabled:opacity-50 text-xs font-display uppercase tracking-wide text-[#0B0B0B] rounded-full border-2 border-[#0B0B0B] transition-all cursor-pointer flex items-center gap-2 active:translate-x-[2px] active:translate-y-[2px]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2 font-comic-body normal-case tracking-normal">
                        <span className="w-3.5 h-3.5 border-2 border-[#0B0B0B] border-t-transparent rounded-full animate-spin" />
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