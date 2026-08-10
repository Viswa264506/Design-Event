import React from 'react';
import { Type, Square, Circle as CircleIcon, Trash2, Copy, Undo2, Redo2 } from 'lucide-react';

const Toolbar = ({
  allowedTypes = [],
  onAddElement,
  onDeleteSelected,
  onDuplicateSelected,
  selectedId,
  undo,
  redo,
  canUndo,
  canRedo,
}) => {
  return (
    <div className="bg-[#1e1f26] border-b border-gray-800 px-6 py-3 flex items-center justify-between gap-4 z-20">
      {/* Element Insertion tools */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider mr-2">Insert:</span>
        
        {allowedTypes.includes('text') && (
          <button
            onClick={() => onAddElement('text')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-white bg-[#282932] border border-gray-700 hover:border-gray-600 rounded-lg transition cursor-pointer"
          >
            <Type size={14} className="text-indigo-400" />
            Text
          </button>
        )}

        {allowedTypes.includes('rectangle') && (
          <button
            onClick={() => onAddElement('rectangle')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-white bg-[#282932] border border-gray-700 hover:border-gray-600 rounded-lg transition cursor-pointer"
          >
            <Square size={14} className="text-indigo-400" />
            Rectangle
          </button>
        )}

        {allowedTypes.includes('circle') && (
          <button
            onClick={() => onAddElement('circle')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-300 hover:text-white bg-[#282932] border border-gray-700 hover:border-gray-600 rounded-lg transition cursor-pointer"
          >
            <CircleIcon size={14} className="text-indigo-400" />
            Circle
          </button>
        )}

        {allowedTypes.length === 0 && (
          <span className="text-xs text-gray-600 italic">No customizable elements allowed to be added.</span>
        )}
      </div>

      {/* Editor history/operations */}
      <div className="flex items-center gap-2">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="p-2 text-gray-400 hover:text-white disabled:text-gray-700 hover:bg-[#282932] rounded-lg transition disabled:cursor-not-allowed cursor-pointer"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={16} />
        </button>
        
        <button
          onClick={redo}
          disabled={!canRedo}
          className="p-2 text-gray-400 hover:text-white disabled:text-gray-700 hover:bg-[#282932] rounded-lg transition disabled:cursor-not-allowed cursor-pointer"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={16} />
        </button>

        <div className="h-4 w-[1px] bg-gray-800 mx-2" />

        <button
          onClick={onDuplicateSelected}
          disabled={!selectedId}
          className="p-2 text-gray-400 hover:text-white disabled:text-gray-700 hover:bg-[#282932] rounded-lg transition disabled:cursor-not-allowed cursor-pointer"
          title="Duplicate Element"
        >
          <Copy size={16} />
        </button>

        <button
          onClick={onDeleteSelected}
          disabled={!selectedId}
          className="p-2 text-red-400 hover:text-red-300 disabled:text-gray-700 hover:bg-red-500/10 rounded-lg transition disabled:cursor-not-allowed cursor-pointer"
          title="Delete Element (Delete)"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
