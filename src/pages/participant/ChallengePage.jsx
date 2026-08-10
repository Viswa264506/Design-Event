import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { useHistory } from '../../hooks/useHistory';
import { useTimer } from '../../hooks/useTimer';
import { getTasksService, submitDesignService, supabase } from '../../services/supabase';
import { tasksData } from '../../data/tasks';

import DesignCanvas from '../../components/editor/DesignCanvas';
import Toolbar from '../../components/editor/Toolbar';
import PropertiesPanel from '../../components/editor/PropertiesPanel';
import TaskPanel from '../../components/editor/TaskPanel';

const ChallengePage = () => {
  const { profile, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState(tasksData);
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const activeTask = tasks[activeTaskIndex] || tasks[0];

  // Selected element ID on active canvas
  const [selectedId, setSelectedId] = useState(null);

  // Global elements state dictionary: { [taskId]: ArrayOfElements }
  const [challengeState, setChallengeState] = useState(() => {
    // Attempt local storage restore
    const saved = localStorage.getItem(`design_event_elements_${profile?.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse elements cache:', e);
      }
    }

    // Default initialization from public configurations
    const initial = {};
    tasksData.forEach(task => {
      initial[task.id] = task.public_config.initialElements || [];
    });
    return initial;
  });

  // Track completion status (whether elements differ from initial configuration)
  const [taskCompletion, setTaskCompletion] = useState({});

  // Sync state to local storage to protect against crashes
  useEffect(() => {
    if (profile?.id) {
      localStorage.setItem(`design_event_elements_${profile.id}`, JSON.stringify(challengeState));
    }

    // Compute completion flags
    const completion = {};
    tasks.forEach(task => {
      const current = challengeState[task.id] || [];
      const initial = task.public_config.initialElements || [];
      // Mark complete if modified or not empty
      completion[task.id] = JSON.stringify(current) !== JSON.stringify(initial) && current.length > 0;
    });
    setTaskCompletion(completion);
  }, [challengeState, profile?.id, tasks]);

  // Hook elements state manager (Undo/Redo) for the current task
  const initialTaskElements = challengeState[activeTask.id] || [];
  const {
    state: currentElements,
    setState: setCurrentElements,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
  } = useHistory(initialTaskElements);

  // Sync changes in useHistory state back into challengeState
  useEffect(() => {
    setChallengeState(prev => {
      if (JSON.stringify(prev[activeTask.id]) === JSON.stringify(currentElements)) return prev;
      return {
        ...prev,
        [activeTask.id]: currentElements
      };
    });
  }, [currentElements, activeTask.id]);

  // Handle swapping tasks
  useEffect(() => {
    const nextElements = challengeState[activeTask.id] || [];
    resetHistory(nextElements);
    setSelectedId(null);
  }, [activeTaskIndex, activeTask.id, resetHistory]);

  // Keyboard Shortcuts Listener
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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, currentElements, undo, redo]);

  // Element actions
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
        color: '#3B82F6',
        borderRadius: 0,
      };
    } else if (type === 'circle') {
      newEl = {
        ...newEl,
        color: '#10B981',
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

    // Shift coordinates slightly
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

  // Submit states
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Submit triggers
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const sessionId = sessionStorage.getItem('design_event_session_id');
      const { data, error } = await submitDesignService(challengeState, sessionId);
      if (error) throw error;

      // Clear local storage cache on success
      localStorage.removeItem(`design_event_elements_${profile.id}`);
      sessionStorage.removeItem('design_event_session_id');
      
      // Update profile context state
      await refreshProfile();
      navigate('/result');
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || 'Submission failed. Please check network connection and try again.');
      setIsSubmitting(false);
    }
  };

  // Handle timer expiration
  const handleTimerExpire = () => {
    console.log('Timer expired, auto-submitting current design...');
    handleFinalSubmit();
  };

  const { formatTime } = useTimer(profile?.started_at, 25, handleTimerExpire);

  const selectedElement = currentElements.find(el => el.id === selectedId);

  return (
    <div className="h-screen bg-[#0d0e12] flex flex-col justify-between overflow-hidden text-gray-100 font-sans">
      
      {/* Top Header */}
      <header className="px-6 py-4 bg-[#14151a] border-b border-gray-800 flex items-center justify-between z-20 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md">
            D
          </div>
          <div>
            <h2 className="font-bold text-sm tracking-wide text-white">DESIGN COMPETITION</h2>
            <p className="text-[10px] text-gray-500 font-semibold">{profile?.name} ({profile?.roll_number})</p>
          </div>
        </div>

        {/* Dynamic Timer display */}
        <div className="flex items-center gap-4">
          <div className="px-4 py-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 font-mono font-bold text-sm tracking-wide animate-pulse">
            Time Left: {formatTime()}
          </div>
          
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white rounded-lg shadow-lg shadow-emerald-600/20 transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Submit Design
          </button>
        </div>
      </header>

      {/* Editor Panel layout */}
      <div className="flex-grow flex overflow-hidden relative">
        <TaskPanel
          tasks={tasks}
          activeTaskIndex={activeTaskIndex}
          setActiveTaskIndex={setActiveTaskIndex}
          taskCompletion={taskCompletion}
        />
        
        <div className="flex-grow flex flex-col overflow-hidden relative">
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
          />
          <DesignCanvas
            elements={currentElements}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            updateElements={setCurrentElements}
          />
        </div>
        
        <PropertiesPanel
          selectedElement={selectedElement}
          onUpdateElement={handleUpdateElement}
        />
      </div>

      {/* Confirmation Submit Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#1e1f26] border border-gray-800 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Submit All Designs?</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Are you sure you want to finish the round? All 10 design workspaces will be evaluated. This action is final and cannot be undone.
            </p>

            {submitError && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/20 border border-red-500/20 text-red-300 text-xs">
                {submitError}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white bg-transparent hover:bg-gray-800 rounded-lg transition disabled:opacity-50 cursor-pointer"
              >
                Go Back
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-xs font-bold text-white rounded-lg transition shadow-lg shadow-emerald-600/20 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-1">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Evaluating...
                  </span>
                ) : (
                  'Yes, Submit'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengePage;
