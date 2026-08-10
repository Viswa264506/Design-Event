import React from 'react';

const PropertiesPanel = ({ selectedElement, onUpdateElement }) => {
  if (!selectedElement) {
    return (
      <div className="w-80 bg-[#1e1f26] border-l border-gray-800 p-6 flex flex-col justify-center items-center text-center">
        <p className="text-gray-500 text-sm">Select an element on the canvas to edit its properties.</p>
      </div>
    );
  }

  const el = selectedElement;

  const handleChange = (key, value) => {
    onUpdateElement({
      ...el,
      [key]: value,
    });
  };

  const handleNumericChange = (key, rawValue, min = 0, max = 800) => {
    let num = parseInt(rawValue, 10);
    if (isNaN(num)) num = min;
    const clamped = Math.max(min, Math.min(max, num));
    handleChange(key, clamped);
  };

  return (
    <div className="w-80 bg-[#1e1f26] border-l border-gray-800 p-6 flex flex-col gap-6 overflow-y-auto z-10 text-gray-300 font-sans">
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Properties Panel</h3>
        <p className="text-[11px] text-gray-500">Edit selected {el.type} attributes</p>
      </div>

      {/* Geometry coordinates */}
      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-800 pb-1">Geometry</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] text-gray-500 mb-1">X Position (px)</label>
            <input
              type="number"
              value={el.x}
              onChange={(e) => handleNumericChange('x', e.target.value, 0, 800)}
              className="w-full px-3 py-1.5 bg-[#14151a] border border-gray-800 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-[11px] text-gray-500 mb-1">Y Position (px)</label>
            <input
              type="number"
              value={el.y}
              onChange={(e) => handleNumericChange('y', e.target.value, 0, 600)}
              className="w-full px-3 py-1.5 bg-[#14151a] border border-gray-800 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] text-gray-500 mb-1">Width (px)</label>
            <input
              type="number"
              value={el.width}
              onChange={(e) => handleNumericChange('width', e.target.value, 5, 800)}
              className="w-full px-3 py-1.5 bg-[#14151a] border border-gray-800 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-[11px] text-gray-500 mb-1">Height (px)</label>
            <input
              type="number"
              value={el.height}
              onChange={(e) => handleNumericChange('height', e.target.value, 5, 600)}
              disabled={el.aspectRatioLocked}
              className="w-full px-3 py-1.5 bg-[#14151a] border border-gray-800 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Text controls */}
      {el.type === 'text' && (
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-800 pb-1">Text Style</h4>
          
          <div>
            <label className="block text-[11px] text-gray-500 mb-1">Text Content</label>
            <textarea
              value={el.text}
              onChange={(e) => handleChange('text', e.target.value)}
              rows={2}
              className="w-full px-3 py-1.5 bg-[#14151a] border border-gray-800 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500 resize-none font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Font Size (px)</label>
              <input
                type="number"
                value={el.fontSize || 14}
                onChange={(e) => handleNumericChange('fontSize', e.target.value, 8, 120)}
                className="w-full px-3 py-1.5 bg-[#14151a] border border-gray-800 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Font Weight</label>
              <select
                value={el.fontWeight || 400}
                onChange={(e) => handleChange('fontWeight', parseInt(e.target.value, 10))}
                className="w-full px-3 py-1.5 bg-[#14151a] border border-gray-800 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value={300}>300 - Light</option>
                <option value={400}>400 - Normal</option>
                <option value={500}>500 - Medium</option>
                <option value={600}>600 - SemiBold</option>
                <option value={700}>700 - Bold</option>
                <option value={900}>900 - ExtraBold</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Font Family</label>
              <select
                value={el.fontFamily || 'Inter'}
                onChange={(e) => handleChange('fontFamily', e.target.value)}
                className="w-full px-3 py-1.5 bg-[#14151a] border border-gray-800 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="monospace">Monospace</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Alignment</label>
              <select
                value={el.align || 'left'}
                onChange={(e) => handleChange('align', e.target.value)}
                className="w-full px-3 py-1.5 bg-[#14151a] border border-gray-800 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Colors & Boarder */}
      {el.type !== 'image' && (
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-800 pb-1">Coloring</h4>
          
          <div>
            <label className="block text-[11px] text-gray-500 mb-1">HEX Color Code</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={el.color || '#cccccc'}
                onChange={(e) => handleChange('color', e.target.value.toUpperCase())}
                className="w-8 h-8 bg-transparent border-0 rounded-lg cursor-pointer shrink-0"
              />
              <input
                type="text"
                value={el.color || '#cccccc'}
                onChange={(e) => handleChange('color', e.target.value.toUpperCase())}
                placeholder="#HEXCODE"
                className="w-full px-3 py-1.5 bg-[#14151a] border border-gray-800 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500 uppercase font-mono"
              />
            </div>
          </div>

          {el.type === 'rectangle' && (
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">Border Radius (px)</label>
              <input
                type="number"
                value={el.borderRadius || 0}
                onChange={(e) => handleNumericChange('borderRadius', e.target.value, 0, Math.min(el.width, el.height) / 2)}
                className="w-full px-3 py-1.5 bg-[#14151a] border border-gray-800 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertiesPanel;
