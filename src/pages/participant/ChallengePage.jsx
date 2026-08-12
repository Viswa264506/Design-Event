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
import { Sparkles, Clock, Send, LogOut, CheckCircle2 } from 'lucide-react';

const ChallengePage = () => {
  const { profile, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks] = useState(tasksData);
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const activeTask = tasks[activeTaskIndex] || tasks[0];

  const [selectedId, setSelectedId] = useState(null);
  const [activeTool, setActiveTool] = useState('select');

  const [challengeState, setChallengeState] = useState(() => {
    const saved = localStorage.getItem(`design_event_elements_${profile?.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse elements cache:', e);
      }
    }

    const initial = {};
    tasksData.forEach(task => {
      initial[task.id] = task.public_config.initialElements || [];
    });
    return initial;
  });

  const [taskCompletion, setTaskCompletion] = useState({});

  useEffect(() => {
    if (profile?.id) {
      localStorage.setItem(`design_event_elements_${profile.id}`, JSON.stringify(challengeState));
    }

    const completion = {};
    tasks.forEach(task => {
      const current = challengeState[task.id] || [];
      const initial = task.public_config.initialElements || [];
      completion[task.id] = JSON.stringify(current) !== JSON.stringify(initial) && current.length > 0;
    });
    setTaskCompletion(completion);
  }, [challengeState, profile?.id, tasks]);

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

  useEffect(() => {
    setChallengeState(prev => {
      if (JSON.stringify(prev[activeTask.id]) === JSON.stringify(currentElements)) return prev;
      return {
        ...prev,
        [activeTask.id]: currentElements
      };
    });
  }, [currentElements, activeTask.id]);

  useEffect(() => {
    const nextElements = challengeState[activeTask.id] || [];
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
      const { error } = await submitDesignService(challengeState, sessionId);
      if (error) throw error;

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
      
      {/* 1. TOP WHITE APPLICATION BAR */}
      <header className="h-14 px-5 bg-white border-b border-[#E5E7EB] flex items-center justify-between z-30 shadow-sm">
        
        {/* Left Brand */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#2563EB] rounded-xl flex items-center justify-center font-extrabold text-white shadow-md shadow-[#2563EB]/20">
              <Sparkles size={16} />
            </div>
            <span className="font-black text-xs tracking-wider text-[#111827] uppercase">
              DESIGN-EVENT
            </span>
          </div>

          <div className="h-4 w-[1px] bg-[#E5E7EB]" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#111827]">Poster Design — Round 1</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/20">
              3rd Year
            </span>
          </div>
        </div>

        {/* Center Task & Timer Display */}
        <div className="flex items-center gap-4">
          <div className="text-xs font-mono font-bold text-[#111827] bg-[#F8FAFF] px-3.5 py-1 rounded-xl border border-[#E5E7EB]">
            Task <strong className="text-[#2563EB]">{String(activeTaskIndex + 1).padStart(2, '0')}</strong> / 10
          </div>

          {/* Timer Display */}
          <div className={`flex items-center gap-2 px-4 py-1 rounded-xl border font-mono font-extrabold text-xs tracking-wider transition ${
            isDangerTime 
              ? 'bg-red-50 border-red-300 text-red-600 animate-pulse'
              : isWarningTime
              ? 'bg-amber-50 border-amber-300 text-amber-600'
              : 'bg-[#EFF6FF] border-[#2563EB]/30 text-[#2563EB]'
          }`}>
            <Clock size={14} />
            <span>{formatTime()}</span>
          </div>
        </div>

        {/* Right Actions & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#16A34A]">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span>Saved</span>
          </div>

          <div className="h-4 w-[1px] bg-[#E5E7EB]" />

          <div className="text-xs font-mono font-bold text-[#111827] bg-[#F8FAFF] px-3 py-1 rounded-xl border border-[#E5E7EB]">
            {profile?.roll_number || '274002'}
          </div>

          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-xs font-bold text-white rounded-xl shadow-md shadow-[#2563EB]/20 transition cursor-pointer"
          >
            <Send size={13} /> Submit Round
          </button>

          <button
            onClick={logout}
            className="p-1.5 text-[#6B7280] hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* 2. MAIN LIGHT EDITOR WORKSPACE */}
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xl space-y-5">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                <CheckCircle2 size={20} className="text-[#2563EB]" /> Submit your design?
              </h3>
              <p className="text-[#6B7280] text-xs leading-relaxed font-medium">
                You will not be able to edit your submission after submitting. All 10 poster workspaces will be evaluated server-side.
              </p>
            </div>

            {submitError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {submitError}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-bold text-[#6B7280] hover:text-[#111827] bg-transparent hover:bg-[#F1F5F9] rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-5 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-xs font-bold text-white rounded-xl transition shadow-md shadow-[#2563EB]/20 cursor-pointer flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
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
      )}

    </div>
  );
};

export default ChallengePage;
