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
    <aside className="w-16 bg-slate-900 border-r border-slate-800 flex flex-col justify-between items-center py-4 z-30 select-none shrink-0 shadow-lg">
      {/* Tool Icons Column */}
      <div className="flex flex-col items-center gap-2.5">
        {/* Select Tool */}
        <button
          onClick={() => setActiveTool('select')}
          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer relative group ${
            activeTool === 'select'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title="Select Tool (V)"
        >
          <MousePointer size={18} />
          <span className="absolute left-16 bg-slate-950 text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-800 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity duration-150 z-50">
            Select <span className="font-mono text-slate-500 text-[10px] ml-1">V</span>
          </span>
        </button>

        <div className="w-8 h-[1px] bg-slate-800/80 my-1" />

        {/* Text Tool */}
        {allowedTypes.includes('text') && (
          <button
            onClick={() => {
              setActiveTool('text');
              onAddElement('text');
            }}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer relative group ${
              activeTool === 'text'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Add Text (T)"
          >
            <Type size={18} />
            <span className="absolute left-16 bg-slate-950 text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-800 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity duration-150 z-50">
              Text <span className="font-mono text-slate-500 text-[10px] ml-1">T</span>
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
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer relative group ${
              activeTool === 'rectangle'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Add Rectangle (R)"
          >
            <Square size={18} />
            <span className="absolute left-16 bg-slate-950 text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-800 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity duration-150 z-50">
              Rectangle <span className="font-mono text-slate-500 text-[10px] ml-1">R</span>
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
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer relative group ${
              activeTool === 'circle'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Add Circle (O)"
          >
            <CircleIcon size={18} />
            <span className="absolute left-16 bg-slate-950 text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-800 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity duration-150 z-50">
              Circle <span className="font-mono text-slate-500 text-[10px] ml-1">O</span>
            </span>
          </button>
        )}

        {/* Image Tool */}
        <button
          onClick={() => {
            setActiveTool('image');
            onAddElement('image');
          }}
          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer relative group ${
            activeTool === 'image'
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title="Add Image (I)"
        >
          <ImageIcon size={18} />
          <span className="absolute left-16 bg-slate-950 text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-800 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity duration-150 z-50">
            Image <span className="font-mono text-slate-500 text-[10px] ml-1">I</span>
          </span>
        </button>

        {/* Logo / Badge Tool */}
        <button
          onClick={() => {
            setActiveTool('logo');
            onAddElement('logo');
          }}
          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer relative group ${
            activeTool === 'logo'
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
              : 'text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10'
          }`}
          title="Add Badge (B)"
        >
          <Sparkles size={18} />
          <span className="absolute left-16 bg-slate-950 text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-800 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity duration-150 z-50">
            Badge <span className="font-mono text-slate-500 text-[10px] ml-1">B</span>
          </span>
        </button>
      </div>

      {/* Undo / Redo / Actions Column */}
      <div className="flex flex-col items-center gap-2 pt-3 border-t border-slate-800/80 w-full px-2">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed relative group"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={16} />
          <span className="absolute left-16 bg-slate-950 text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-800 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity duration-150 z-50">
            Undo <span className="font-mono text-slate-500 text-[10px] ml-1">⌘Z</span>
          </span>
        </button>

        <button
          onClick={redo}
          disabled={!canRedo}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed relative group"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={16} />
          <span className="absolute left-16 bg-slate-950 text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-800 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity duration-150 z-50">
            Redo <span className="font-mono text-slate-500 text-[10px] ml-1">⌘Y</span>
          </span>
        </button>

        <button
          onClick={onDuplicateSelected}
          disabled={!selectedId}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed relative group"
          title="Duplicate Element"
        >
          <Copy size={16} />
          <span className="absolute left-16 bg-slate-950 text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-800 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity duration-150 z-50">
            Duplicate
          </span>
        </button>

        <button
          onClick={onDeleteSelected}
          disabled={!selectedId}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-red-400 hover:text-white hover:bg-red-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed relative group"
          title="Delete Element (Delete)"
        >
          <Trash2 size={16} />
          <span className="absolute left-16 bg-slate-950 text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-800 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity duration-150 z-50">
            Delete <span className="font-mono text-slate-500 text-[10px] ml-1">Del</span>
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Toolbar;

