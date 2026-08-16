import React from 'react';
import { ArrowLeft, ArrowRight, Target, FileText, Layers } from 'lucide-react';

// Matches "Some Name (id: some_id):" — marks where a new component's spec block starts.
const COMPONENT_REGEX = /([A-Z][\w\s/]*?)\s*\(id:\s*([\w]+)\)\s*:/g;

// Matches "Key = Value" where Value can be a quoted string, a hex color, or a word/number (with optional px).
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

// Splits an instruction string into an overall description + per-component
// spec groups (when the instruction defines multiple named/id'd parts),
// or a single flat spec list (when it's just one simple element).
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
  <div className="bg-white border border-[#E5E7EB] rounded-xl px-3 py-2 flex flex-col items-start min-w-0">
    <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide">{label}</span>
    <span className="flex items-center gap-1.5 text-xs sm:text-sm font-mono font-extrabold text-[#2563EB] max-w-full">
      {value.startsWith('#') && (
        <span
          className="w-3 h-3 rounded-full border border-[#E5E7EB] shrink-0"
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

          <h2 className="text-base font-extrabold text-[#111827] leading-snug">{activeTask.title}</h2>

          {/* Instructions & Requirements Box */}
          <div className="bg-[#F8FAFF] p-4 rounded-2xl border border-[#E5E7EB] space-y-4 font-medium">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#111827] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">
              <FileText size={14} className="text-[#2563EB]" /> Requirements
            </div>

            {/* Overall description */}
            {description && (
              <p className="text-sm text-[#1F2937] font-semibold leading-relaxed">
                {description}
              </p>
            )}

            {/* Single-element tasks: one flat spec grid */}
            {flatSpecs.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {flatSpecs.map((spec, i) => (
                  <SpecChip key={i} label={spec.label} value={spec.value} />
                ))}
              </div>
            )}

            {/* Multi-element tasks: each component gets its own labeled, separated block */}
            {components.length > 0 && (
              <div className="space-y-3.5">
                {components.map((comp, i) => (
                  <div
                    key={comp.id || i}
                    className="bg-white rounded-xl border border-[#E5E7EB] p-3 space-y-2.5"
                  >
                    <div className="flex items-center gap-1.5">
                      <Layers size={12} className="text-[#2563EB] shrink-0" />
                      <span className="text-xs font-extrabold text-[#111827] truncate">
                        {comp.name}
                      </span>
                      {comp.id && (
                        <span className="text-[9px] font-mono font-bold text-[#9CA3AF] bg-[#F3F4F6] px-1.5 py-0.5 rounded-md ml-auto shrink-0">
                          {comp.id}
                        </span>
                      )}
                    </div>
                    {comp.specs.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
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
            <div className="bg-[#F8FAFF] p-3 rounded-2xl border border-[#E5E7EB] space-y-2">
              <h4 className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">Reference Design Target</h4>
              <div className="rounded-xl overflow-hidden border border-[#E5E7EB] bg-white p-1">
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