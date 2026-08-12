import React from 'react';
import { MousePointer, Type, Square, Circle as CircleIcon, Trash2, Copy, Undo2, Redo2, Image as ImageIcon, Sparkles } from 'lucide-react';

const Toolbar = ({
  allowedTypes = ['text', 'rectangle', 'circle'],
  onAddElement,
  onDeleteSelected,
  onDuplicateSelected,
  selectedId,
  undo,
  redo,
  canUndo,
  canRedo,
  activeTool = 'select',
  setActiveTool = () => {}
}) => {
  return (
    <aside className="w-14 bg-white border-r border-[#E5E7EB] flex flex-col justify-between items-center py-3 z-30 select-none shadow-sm">
      {/* Tool Icons Column */}
      <div className="flex flex-col items-center gap-2">
        {/* Select Tool */}
        <button
          onClick={() => setActiveTool('select')}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer relative group ${
            activeTool === 'select'
              ? 'bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/20'
              : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F1F5F9]'
          }`}
          title="Select Tool (V)"
        >
          <MousePointer size={17} />
          <span className="absolute left-14 bg-[#111827] text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition z-50">
            Select (V)
          </span>
        </button>

        <div className="w-8 h-[1px] bg-[#E5E7EB] my-1" />

        {/* Text Tool */}
        {allowedTypes.includes('text') && (
          <button
            onClick={() => {
              setActiveTool('text');
              onAddElement('text');
            }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer relative group ${
              activeTool === 'text'
                ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/30'
                : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F1F5F9]'
            }`}
            title="Add Text (T)"
          >
            <Type size={17} />
            <span className="absolute left-14 bg-[#111827] text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition z-50">
              Add Text (T)
            </span>
          </button>
        )}

        {/* Rectangle Tool */}
        {allowedTypes.includes('rectangle') && (
          <button
            onClick={() => {
              setActiveTool('rectangle');
              onAddElement('rectangle');
            }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer relative group ${
              activeTool === 'rectangle'
                ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/30'
                : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F1F5F9]'
            }`}
            title="Add Rectangle (R)"
          >
            <Square size={17} />
            <span className="absolute left-14 bg-[#111827] text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition z-50">
              Add Rectangle (R)
            </span>
          </button>
        )}

        {/* Circle Tool */}
        {allowedTypes.includes('circle') && (
          <button
            onClick={() => {
              setActiveTool('circle');
              onAddElement('circle');
            }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer relative group ${
              activeTool === 'circle'
                ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/30'
                : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F1F5F9]'
            }`}
            title="Add Circle (O)"
          >
            <CircleIcon size={17} />
            <span className="absolute left-14 bg-[#111827] text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition z-50">
              Add Circle (O)
            </span>
          </button>
        )}

        {/* Image Tool */}
        <button
          onClick={() => {
            setActiveTool('image');
            onAddElement('image');
          }}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer relative group ${
            activeTool === 'image'
              ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/30'
              : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F1F5F9]'
          }`}
          title="Add Image (I)"
        >
          <ImageIcon size={17} />
          <span className="absolute left-14 bg-[#111827] text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition z-50">
            Add Image (I)
          </span>
        </button>

        {/* Logo / Badge Tool */}
        <button
          onClick={() => {
            setActiveTool('logo');
            onAddElement('logo');
          }}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer relative group ${
            activeTool === 'logo'
              ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/30'
              : 'text-[#6B7280] hover:text-[#2563EB] hover:bg-[#EFF6FF]'
          }`}
          title="Add Badge (B)"
        >
          <Sparkles size={17} />
          <span className="absolute left-14 bg-[#111827] text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition z-50">
            Add Badge (B)
          </span>
        </button>
      </div>

      {/* Undo / Redo / Actions Column */}
      <div className="flex flex-col items-center gap-1.5 pt-3 border-t border-[#E5E7EB] w-full px-2">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[#6B7280] hover:text-[#111827] disabled:text-[#9CA3AF]/40 hover:bg-[#F1F5F9] disabled:hover:bg-transparent transition cursor-pointer disabled:cursor-not-allowed relative group"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={16} />
          <span className="absolute left-14 bg-[#111827] text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition z-50">
            Undo (Ctrl+Z)
          </span>
        </button>

        <button
          onClick={redo}
          disabled={!canRedo}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[#6B7280] hover:text-[#111827] disabled:text-[#9CA3AF]/40 hover:bg-[#F1F5F9] disabled:hover:bg-transparent transition cursor-pointer disabled:cursor-not-allowed relative group"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={16} />
          <span className="absolute left-14 bg-[#111827] text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition z-50">
            Redo (Ctrl+Y)
          </span>
        </button>

        <button
          onClick={onDuplicateSelected}
          disabled={!selectedId}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[#6B7280] hover:text-[#111827] disabled:text-[#9CA3AF]/40 hover:bg-[#F1F5F9] disabled:hover:bg-transparent transition cursor-pointer disabled:cursor-not-allowed relative group"
          title="Duplicate Element"
        >
          <Copy size={16} />
          <span className="absolute left-14 bg-[#111827] text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition z-50">
            Duplicate
          </span>
        </button>

        <button
          onClick={onDeleteSelected}
          disabled={!selectedId}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[#DC2626] hover:text-white hover:bg-[#DC2626] disabled:text-[#9CA3AF]/40 disabled:hover:bg-transparent transition cursor-pointer disabled:cursor-not-allowed relative group"
          title="Delete Element (Delete)"
        >
          <Trash2 size={16} />
          <span className="absolute left-14 bg-[#111827] text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition z-50">
            Delete (Del)
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Toolbar;
