import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle } from 'lucide-react';

const TaskPanel = ({
  tasks = [],
  activeTaskIndex = 0,
  setActiveTaskIndex,
  taskCompletion = {}, // { taskId: boolean }
}) => {
  const activeTask = tasks[activeTaskIndex];

  const handleNext = () => {
    if (activeTaskIndex < tasks.length - 1) {
      setActiveTaskIndex(activeTaskIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeTaskIndex > 0) {
      setActiveTaskIndex(activeTaskIndex - 1);
    }
  };

  return (
    <div className="w-80 bg-[#1e1f26] border-r border-gray-800 flex flex-col justify-between z-10 text-gray-300 font-sans">
      {/* Top list & instruction details */}
      <div className="flex-grow flex flex-col overflow-y-auto">
        
        {/* Navigation Sidebar Title */}
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Round 1 Tasks</h3>
          <p className="text-[11px] text-gray-500">Complete tasks in sequence. All designs autosave locally.</p>
        </div>

        {/* Task Grid Selection */}
        <div className="p-4 border-b border-gray-800">
          <div className="grid grid-cols-5 gap-2">
            {tasks.map((task, idx) => {
              const isActive = idx === activeTaskIndex;
              const isCompleted = taskCompletion[task.id];

              return (
                <button
                  key={task.id}
                  onClick={() => setActiveTaskIndex(idx)}
                  className={`h-10 rounded-lg flex flex-col items-center justify-center text-xs font-bold border transition relative cursor-pointer
                    ${isActive 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow shadow-indigo-500/20' 
                      : 'bg-[#14151a] border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                    }`}
                >
                  {idx + 1}
                  {isCompleted && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-[#1e1f26]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Task Description */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-indigo-400 tracking-wider uppercase">
              Task {activeTaskIndex + 1} of {tasks.length}
            </span>
            <span className="text-[10px] text-gray-500">Max Score: {activeTask.max_points} Pts</span>
          </div>

          <h2 className="text-lg font-bold text-white leading-tight">{activeTask.title}</h2>
          
          <div className="bg-[#14151a] p-4 rounded-xl border border-gray-800/80 text-xs leading-relaxed text-gray-400 font-medium">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Instructions</h4>
            <p>{activeTask.instruction}</p>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="p-6 border-t border-gray-800 flex items-center justify-between gap-4 bg-[#1b1c22]">
        <button
          onClick={handlePrev}
          disabled={activeTaskIndex === 0}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-[#282932] hover:bg-[#2f313c] border border-gray-700 disabled:opacity-30 disabled:hover:bg-[#282932] disabled:cursor-not-allowed text-xs font-semibold text-white rounded-lg transition cursor-pointer"
        >
          <ArrowLeft size={14} />
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={activeTaskIndex === tasks.length - 1}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:hover:bg-indigo-600 disabled:cursor-not-allowed text-xs font-semibold text-white rounded-lg transition shadow-md shadow-indigo-600/10 cursor-pointer"
        >
          Next
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default TaskPanel;
