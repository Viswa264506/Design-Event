import React from 'react';
import { Sliders, Layers, AlignLeft, AlignCenter, AlignRight, Type, Move, Palette } from 'lucide-react';

const PropertiesPanel = ({ selectedElement, onUpdateElement, elements = [], onSelectElement }) => {
  if (!selectedElement) {
    return (
      <aside className="w-80 bg-slate-900 border-l border-slate-800 p-5 flex flex-col justify-between select-none z-20 shadow-lg shrink-0 text-slate-100 font-sans">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sliders size={14} className="text-blue-400" /> Inspector
            </h3>
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">No Selection</span>
          </div>

          <div className="py-12 text-center text-slate-400 space-y-2">
            <Move size={28} className="mx-auto text-slate-600 mb-2" />
            <p className="text-xs font-bold text-slate-200">No Element Selected</p>
            <p className="text-[11px] text-slate-400 max-w-[200px] mx-auto leading-relaxed">
              Click any element on the canvas to inspect and edit its positioning, dimensions, colors, and typography.
            </p>
          </div>

          {/* Layers Overview */}
          {elements.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-slate-800">
              <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Layers size={13} className="text-blue-400" /> Canvas Layers ({elements.length})
              </h4>
              <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                {elements.map((item, idx) => (
                  <button
                    key={item.id || idx}
                    onClick={() => onSelectElement && onSelectElement(item.id)}
                    className="w-full text-left px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-blue-500/40 text-xs text-slate-300 hover:text-white flex items-center justify-between transition cursor-pointer"
                  >
                    <span className="font-mono text-[11px] truncate font-semibold">{item.id}</span>
                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {item.type}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-[10px] font-mono text-slate-500 text-center pt-4 border-t border-slate-800">
          Studio Precision Inspector v2.0
        </div>
      </aside>
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
    <aside className="w-80 bg-slate-900 border-l border-slate-800 p-5 flex flex-col justify-between overflow-y-auto z-20 select-none text-slate-100 font-sans shadow-lg shrink-0">
      <div className="space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Sliders size={14} className="text-blue-400" /> Inspector
          </h3>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
            {el.type}
          </span>
        </div>

        {/* 1. POSITION */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Position</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 focus-within:border-blue-500">
              <span className="text-xs font-mono font-bold text-slate-500 mr-2">X</span>
              <input
                type="number"
                value={el.x}
                onChange={(e) => handleNumericChange('x', e.target.value, 0, 800)}
                className="w-full bg-transparent text-xs text-slate-100 font-mono font-bold focus:outline-none"
              />
            </div>
            <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 focus-within:border-blue-500">
              <span className="text-xs font-mono font-bold text-slate-500 mr-2">Y</span>
              <input
                type="number"
                value={el.y}
                onChange={(e) => handleNumericChange('y', e.target.value, 0, 600)}
                className="w-full bg-transparent text-xs text-slate-100 font-mono font-bold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 2. SIZE */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Dimensions</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 focus-within:border-blue-500">
              <span className="text-xs font-mono font-bold text-slate-500 mr-2">W</span>
              <input
                type="number"
                value={el.width}
                onChange={(e) => handleNumericChange('width', e.target.value, 5, 800)}
                className="w-full bg-transparent text-xs text-slate-100 font-mono font-bold focus:outline-none"
              />
            </div>
            <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 focus-within:border-blue-500">
              <span className="text-xs font-mono font-bold text-slate-500 mr-2">H</span>
              <input
                type="number"
                value={el.height}
                onChange={(e) => handleNumericChange('height', e.target.value, 5, 600)}
                className="w-full bg-transparent text-xs text-slate-100 font-mono font-bold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. TYPOGRAPHY */}
        {el.type === 'text' && (
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Type size={13} className="text-blue-400" /> Typography
            </h4>
            
            <div>
              <label className="block text-[10px] text-slate-400 mb-1.5 font-semibold">Text Content</label>
              <textarea
                value={el.text}
                onChange={(e) => handleChange('text', e.target.value)}
                rows={2}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500 rounded-xl p-2.5 text-xs text-slate-100 font-sans focus:outline-none resize-none font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1 font-mono">Font Size (px)</label>
                <input
                  type="number"
                  value={el.fontSize || 14}
                  onChange={(e) => handleNumericChange('fontSize', e.target.value, 8, 120)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Weight</label>
                <select
                  value={el.fontWeight || 400}
                  onChange={(e) => handleChange('fontWeight', parseInt(e.target.value, 10))}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-100 focus:outline-none cursor-pointer font-semibold"
                >
                  <option value={300}>300 Light</option>
                  <option value={400}>400 Normal</option>
                  <option value={500}>500 Medium</option>
                  <option value={600}>600 SemiBold</option>
                  <option value={700}>700 Bold</option>
                  <option value={900}>900 Black</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Alignment</label>
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
                {[
                  { id: 'left', icon: AlignLeft },
                  { id: 'center', icon: AlignCenter },
                  { id: 'right', icon: AlignRight },
                ].map(item => {
                  const IconComp = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleChange('align', item.id)}
                      className={`flex-1 py-1.5 rounded-lg flex items-center justify-center transition cursor-pointer ${
                        (el.align || 'left') === item.id
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <IconComp size={14} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 4. APPEARANCE & FILL */}
        {el.type !== 'image' && (
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Palette size={13} className="text-blue-400" /> Style &amp; Colors
            </h4>
            
            <div>
              <label className="block text-[10px] text-slate-400 mb-1 font-semibold">Fill Hex Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={el.color || el.backgroundColor || '#CCCCCC'}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    onUpdateElement({
                      ...el,
                      color: val,
                      backgroundColor: val,
                    });
                  }}
                  className="w-9 h-9 bg-transparent border-0 rounded cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={el.color || el.backgroundColor || '#CCCCCC'}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    onUpdateElement({
                      ...el,
                      color: val,
                      backgroundColor: val,
                    });
                  }}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono uppercase font-bold focus:outline-none"
                />
              </div>
            </div>

            {el.type === 'rectangle' && (
              <div>
                <label className="block text-[10px] text-slate-400 mb-1 font-mono">Border Radius (px)</label>
                <input
                  type="number"
                  value={el.borderRadius || 0}
                  onChange={(e) => handleNumericChange('borderRadius', e.target.value, 0, 50)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono font-bold focus:outline-none"
                />
              </div>
            )}
          </div>
        )}

        {/* Layers List */}
        {elements.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-slate-800">
            <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={13} className="text-blue-400" /> Canvas Layers
            </h4>
            <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
              {elements.map((item, idx) => (
                <button
                  key={item.id || idx}
                  onClick={() => onSelectElement && onSelectElement(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl border text-xs flex items-center justify-between transition cursor-pointer ${
                    item.id === el.id
                      ? 'bg-blue-500/15 border-blue-500/40 text-blue-400 font-bold'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="font-mono text-[11px] truncate font-semibold">{item.id}</span>
                  <span className="text-[9px] font-mono uppercase font-extrabold px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    {item.type}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      <div className="text-[10px] font-mono text-slate-500 text-center pt-4 border-t border-slate-800">
        ELEMENT ID: {el.id}
      </div>
    </aside>
  );
};

export default PropertiesPanel;

