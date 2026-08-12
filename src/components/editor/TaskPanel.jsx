import React from 'react';
import { ArrowLeft, ArrowRight, Target, FileText, Check } from 'lucide-react';

const TaskPanel = ({
  tasks = [],
  activeTaskIndex = 0,
  setActiveTaskIndex,
  taskCompletion = {},
}) => {
  const activeTask = tasks[activeTaskIndex] || {};

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
    <aside className="w-72 bg-white border-r border-[#E5E7EB] flex flex-col justify-between z-20 text-[#111827] font-sans select-none shadow-sm">
      
      <div className="flex-grow flex flex-col overflow-y-auto">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E5E7EB] space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center gap-2">
              <Target size={14} className="text-[#2563EB]" /> POSTER TASKS
            </h3>
            <span className="text-[10px] font-mono font-bold text-[#6B7280]">10 Workspaces</span>
          </div>
          <p className="text-xs text-[#6B7280]">
            Complete all 10 poster tasks. All designs autosave live.
          </p>
        </div>

        {/* Task Buttons 01 to 10 */}
        <div className="p-4 border-b border-[#E5E7EB] bg-[#F8FAFF]">
          <div className="grid grid-cols-5 gap-1.5">
            {tasks.map((task, idx) => {
              const isActive = idx === activeTaskIndex;
              const isCompleted = taskCompletion[task.id];

              return (
                <button
                  key={task.id || idx}
                  onClick={() => setActiveTaskIndex(idx)}
                  className={`h-9 rounded-xl flex items-center justify-center text-xs font-mono font-bold transition relative cursor-pointer ${
                    isActive 
                      ? 'bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/20 border border-[#2563EB]' 
                      : isCompleted
                      ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/30'
                      : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:border-[#94A3B8]'
                  }`}
                  title={`Task ${idx + 1}: ${task.title}`}
                >
                  {String(idx + 1).padStart(2, '0')}
                  {isCompleted && !isActive && (
                    <span className="absolute top-0.5 right-0.5 text-[9px] font-bold text-[#2563EB]">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Task Requirements */}
        <div className="p-5 space-y-4">
          <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider">
            <span className="text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full border border-[#2563EB]/20">
              TASK {String(activeTaskIndex + 1).padStart(2, '0')} / {String(tasks.length).padStart(2, '0')}
            </span>
            <span className="text-[#6B7280] font-semibold">{activeTask.max_points || 10} Points</span>
          </div>

          <h2 className="text-sm font-extrabold text-[#111827] leading-snug">{activeTask.title}</h2>
          
          {/* Instructions & Requirements Box */}
          <div className="bg-[#F8FAFF] p-4 rounded-2xl border border-[#E5E7EB] text-xs leading-relaxed text-[#4B5563] space-y-2.5 font-medium">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#111827] uppercase tracking-wider border-b border-[#E5E7EB] pb-1.5">
              <FileText size={13} className="text-[#2563EB]" /> Requirements
            </div>
            <p className="text-xs text-[#111827] font-semibold">{activeTask.instruction}</p>
          </div>
        </div>

      </div>

      {/* Navigation Footer */}
      <div className="p-4 border-t border-[#E5E7EB] flex items-center justify-between gap-3 bg-[#F8FAFF]">
        <button
          onClick={handlePrev}
          disabled={activeTaskIndex === 0}
          className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-white hover:bg-[#F1F5F9] border border-[#E5E7EB] disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed text-xs font-bold text-[#111827] rounded-xl transition cursor-pointer shadow-sm"
        >
          <ArrowLeft size={14} /> Prev
        </button>

        <button
          onClick={handleNext}
          disabled={activeTaskIndex === tasks.length - 1}
          className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 disabled:hover:bg-[#2563EB] disabled:cursor-not-allowed text-xs font-bold text-white rounded-xl transition shadow-md shadow-[#2563EB]/20 cursor-pointer"
        >
          Next <ArrowRight size={14} />
        </button>
      </div>

    </aside>
  );
};

export default TaskPanel;
