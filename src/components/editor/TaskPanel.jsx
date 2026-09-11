import React from 'react';
import { ArrowLeft, ArrowRight, Target, FileText, Layers, CheckCircle2 } from 'lucide-react';

const COMPONENT_REGEX = /([A-Z][\w\s/]*?)\s*\(id:\s*([\w]+)\)\s*:/g;
const KV_REGEX = /([A-Za-z][A-Za-z\s]{0,20}?)\s*=\s*('[^']*'|#[0-9A-Fa-f]{3,8}|[\w.]+)/g;

const cleanValue = (value) => value.replace(/^'|'$/g, '');

const extractSpecs = (text = '') => {
  const specs = [];
  const re = new RegExp(KV_REGEX.source, 'g');
  let m;
  while ((m = re.exec(text)) !== null) {
    specs.push({ label: m[1].trim(), value: cleanValue(m[2]) });
  }
  return specs;
};

const parseInstruction = (instruction = '') => {
  const markers = [];
  const re = new RegExp(COMPONENT_REGEX.source, 'g');
  let m;
  while ((m = re.exec(instruction)) !== null) {
    markers.push({ name: m[1].trim(), id: m[2], start: m.index, specStart: re.lastIndex });
  }

  if (markers.length === 0) {
    const specs = extractSpecs(instruction);
    const description = instruction
      .replace(new RegExp(KV_REGEX.source, 'g'), '')
      .replace(/,?\s{2,}/g, ' ')
      .replace(/\s+([.,])/g, '$1')
      .trim();
    return { description, components: [], flatSpecs: specs };
  }

  const description = instruction
    .slice(0, markers[0].start)
    .replace(/[\d.:\s]+$/, '')
    .trim();

  const components = markers.map((marker, i) => {
    const end = i + 1 < markers.length ? markers[i + 1].start : instruction.length;
    const specText = instruction.slice(marker.specStart, end);
    return { name: marker.name, id: marker.id, specs: extractSpecs(specText) };
  });

  return { description, components, flatSpecs: [] };
};

const SpecChip = ({ label, value }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex flex-col items-start min-w-0">
    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wider">{label}</span>
    <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-blue-400 max-w-full mt-0.5">
      {value.startsWith('#') && (
        <span
          className="w-3 h-3 rounded-full border border-slate-700 shrink-0"
          style={{ backgroundColor: value }}
        />
      )}
      <span className="break-all leading-tight">{value}</span>
    </span>
  </div>
);

const TaskPanel = ({
  tasks = [],
  activeTaskIndex = 0,
  setActiveTaskIndex,
  taskCompletion = {},
}) => {
  const activeTask = tasks[activeTaskIndex] || {};
  const { description, components, flatSpecs } = parseInstruction(activeTask.instruction || '');

  const completedCount = Object.values(taskCompletion).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / (tasks.length || 1)) * 100);

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
    <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col justify-between z-20 text-slate-100 font-sans select-none shrink-0 shadow-lg">

      <div className="flex-grow flex flex-col overflow-y-auto">

        {/* Header */}
        <div className="p-4 border-b border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Target size={14} className="text-blue-400" /> POSTER TASKS
            </h3>
            <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              {completedCount} / {tasks.length} Done
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Task Buttons 01 to 10 */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-950/40">
          <div className="grid grid-cols-5 gap-1.5">
            {tasks.map((task, idx) => {
              const isActive = idx === activeTaskIndex;
              const isCompleted = taskCompletion[task.id];

              return (
                <button
                  key={task.id || idx}
                  onClick={() => setActiveTaskIndex(idx)}
                  className={`h-9 rounded-xl flex items-center justify-center text-xs font-mono font-bold transition-all relative cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 border border-blue-500'
                      : isCompleted
                      ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25'
                      : 'bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                  }`}
                  title={`Task ${idx + 1}: ${task.title}`}
                >
                  {String(idx + 1).padStart(2, '0')}
                  {isCompleted && !isActive && (
                    <CheckCircle2 size={10} className="absolute top-1 right-1 text-blue-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Task Requirements */}
        <div className="p-5 space-y-4">
          <div className="flex justify-between items-center text-[10px] uppercase font-mono font-bold tracking-wider">
            <span className="text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
              TASK {String(activeTaskIndex + 1).padStart(2, '0')} / {String(tasks.length).padStart(2, '0')}
            </span>
            <span className="text-slate-400 font-semibold">{activeTask.max_points || 10} Points</span>
          </div>

          <h2 className="text-base font-bold text-white leading-snug">{activeTask.title}</h2>

          {/* Instructions & Requirements Box */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2.5">
              <span className="flex items-center gap-1.5">
                <FileText size={14} className="text-blue-400" /> Requirements
              </span>
              <span className="text-[10px] font-mono text-slate-500">±3px TOLERANCE</span>
            </div>

            {/* Overall description */}
            {description && (
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                {description}
              </p>
            )}

            {/* Single-element tasks */}
            {flatSpecs.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {flatSpecs.map((spec, i) => (
                  <SpecChip key={i} label={spec.label} value={spec.value} />
                ))}
              </div>
            )}

            {/* Multi-element tasks */}
            {components.length > 0 && (
              <div className="space-y-3">
                {components.map((comp, i) => (
                  <div
                    key={comp.id || i}
                    className="bg-slate-900 rounded-xl border border-slate-800 p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Layers size={13} className="text-blue-400 shrink-0" />
                        <span className="text-xs font-bold text-slate-200 truncate">
                          {comp.name}
                        </span>
                      </div>
                      {comp.id && (
                        <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                          {comp.id}
                        </span>
                      )}
                    </div>
                    {comp.specs.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {comp.specs.map((spec, j) => (
                          <SpecChip key={j} label={spec.label} value={spec.value} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {activeTask.reference_asset && (
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider">Reference Target</h4>
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-white p-1">
                <img
                  src={activeTask.reference_asset}
                  alt={`${activeTask.title} Reference`}
                  className="w-full h-auto object-contain max-h-48 rounded-lg"
                />
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Navigation Footer */}
      <div className="p-3 border-t border-slate-800 flex items-center justify-between gap-2.5 bg-slate-950/80">
        <button
          onClick={handlePrev}
          disabled={activeTaskIndex === 0}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 disabled:cursor-not-allowed text-xs font-semibold rounded-xl transition cursor-pointer"
        >
          <ArrowLeft size={14} /> Prev Task
        </button>

        <button
          onClick={handleNext}
          disabled={activeTaskIndex === tasks.length - 1}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-white rounded-xl transition shadow-md shadow-blue-600/25 cursor-pointer"
        >
          Next Task <ArrowRight size={14} />
        </button>
      </div>

    </aside>
  );
};

export default TaskPanel;