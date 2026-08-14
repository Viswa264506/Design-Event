import React, { useRef, useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Grid } from 'lucide-react';

const DesignCanvas = ({ elements, selectedId, setSelectedId, updateElements }) => {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [dragState, setDragState] = useState(null);

  // Resize canvas scale factor based on container width & height
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        const parent = canvasRef.current.parentElement;
        const scaleX = (parent.clientWidth - 80) / 800; // padding
        const scaleY = (parent.clientHeight - 100) / 600;
        const newScale = Math.max(0.4, Math.min(scaleX, scaleY, 1));
        setScale(newScale);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current || e.target.classList.contains('canvas-surface')) {
      setSelectedId(null);
    }
  };

  const handleElementMouseDown = (e, element) => {
    e.stopPropagation();
    setSelectedId(element.id);

    setDragState({
      type: 'move',
      elementId: element.id,
      startX: element.x,
      startY: element.y,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
    });
  };

  const handleHandleMouseDown = (e, handle, element) => {
    e.stopPropagation();
    e.preventDefault();

    setDragState({
      type: 'resize',
      handle,
      elementId: element.id,
      startX: element.x,
      startY: element.y,
      startWidth: element.width,
      startHeight: element.height,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      aspectRatioLocked: element.aspectRatioLocked || false,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragState) return;

      const element = elements.find(el => el.id === dragState.elementId);
      if (!element) return;

      const deltaX = (e.clientX - dragState.startMouseX) / scale;
      const deltaY = (e.clientY - dragState.startMouseY) / scale;

      let newElements = elements.map(el => {
        if (el.id !== element.id) return el;

        if (dragState.type === 'move') {
          const nextX = Math.round(dragState.startX + deltaX);
          const nextY = Math.round(dragState.startY + deltaY);
          return {
            ...el,
            x: Math.max(0, Math.min(800 - el.width, nextX)),
            y: Math.max(0, Math.min(600 - el.height, nextY)),
          };
        }

        if (dragState.type === 'resize') {
          const handle = dragState.handle;
          let nextWidth = el.width;
          let nextHeight = el.height;
          let nextX = el.x;
          let nextY = el.y;

          const minSize = 10;

          if (handle === 'br') {
            nextWidth = Math.max(minSize, Math.round(dragState.startWidth + deltaX));
            nextHeight = Math.max(minSize, Math.round(dragState.startHeight + deltaY));
            if (dragState.aspectRatioLocked) {
              const ratio = dragState.startWidth / dragState.startHeight;
              nextHeight = Math.round(nextWidth / ratio);
            }
          } else if (handle === 'r') {
            nextWidth = Math.max(minSize, Math.round(dragState.startWidth + deltaX));
          } else if (handle === 'b') {
            nextHeight = Math.max(minSize, Math.round(dragState.startHeight + deltaY));
          } else if (handle === 'tl') {
            const possibleWidth = dragState.startWidth - deltaX;
            const possibleHeight = dragState.startHeight - deltaY;

            if (possibleWidth >= minSize) {
              nextWidth = Math.round(possibleWidth);
              nextX = Math.round(dragState.startX + deltaX);
            }
            if (possibleHeight >= minSize) {
              nextHeight = Math.round(possibleHeight);
              nextY = Math.round(dragState.startY + deltaY);
            }
          } else if (handle === 'tr') {
            nextWidth = Math.max(minSize, Math.round(dragState.startWidth + deltaX));
            const possibleHeight = dragState.startHeight - deltaY;

            if (possibleHeight >= minSize) {
              nextHeight = Math.round(possibleHeight);
              nextY = Math.round(dragState.startY + deltaY);
            }
          } else if (handle === 'bl') {
            const possibleWidth = dragState.startWidth - deltaX;
            if (possibleWidth >= minSize) {
              nextWidth = Math.round(possibleWidth);
              nextX = Math.round(dragState.startX + deltaX);
            }
            nextHeight = Math.max(minSize, Math.round(dragState.startHeight + deltaY));
          }

          return {
            ...el,
            x: Math.max(0, Math.min(800, nextX)),
            y: Math.max(0, Math.min(600, nextY)),
            width: Math.min(800 - nextX, nextWidth),
            height: Math.min(600 - nextY, nextHeight),
          };
        }

        return el;
      });

      updateElements(newElements);
    };

    const handleMouseUp = () => {
      setDragState(null);
    };

    if (dragState) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, elements, scale, updateElements]);

  return (
    <div className="w-full h-full relative flex flex-col justify-between items-center bg-[#F1F5F9] overflow-hidden select-none p-6">
      
      {/* Workspace Canvas Container */}
      <div className="w-full h-full flex items-center justify-center relative">
        <div 
          style={{ width: 800, height: 600, transform: `scale(${scale})`, transformOrigin: 'center center' }} 
          className="shrink-0 relative transition-transform duration-75 shadow-2xl rounded-sm"
        >
          {/* Logical Canvas 800x600 Surface */}
          <div
            ref={canvasRef}
            onClick={handleCanvasClick}
            style={{ width: 800, height: 600 }}
            className="absolute inset-0 bg-white border border-[#CBD5E1] overflow-hidden canvas-surface shadow-2xl cursor-default"
          >
            {/* Subtle Light Gray Grid */}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none opacity-40" style={{
                backgroundImage: 'radial-gradient(circle, #CBD5E1 1.5px, transparent 1.5px)',
                backgroundSize: '20px 20px'
              }} />
            )}

            {elements.map((el) => {
              const isSelected = selectedId === el.id;
              
              const elementStyle = {
                position: 'absolute',
                left: `${el.x}px`,
                top: `${el.y}px`,
                width: `${el.width}px`,
                height: `${el.height}px`,
                cursor: 'move',
              };

              return (
                <div
                  key={el.id}
                  style={elementStyle}
                  onMouseDown={(e) => handleElementMouseDown(e, el)}
                  className={`relative group ${isSelected ? 'ring-2 ring-[#2563EB] z-30' : 'hover:ring-1 hover:ring-[#2563EB]/40 z-10'}`}
                >
                  {/* Element Content */}
                  {el.type === 'text' && (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        fontSize: `${el.fontSize || 14}px`,
                        fontWeight: el.fontWeight || 400,
                        fontFamily: el.fontFamily || 'Inter, sans-serif',
                        color: el.color || '#000000',
                        textAlign: el.align || 'left',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: el.align === 'center' ? 'center' : el.align === 'right' ? 'flex-end' : 'flex-start',
                      }}
                    >
                      {el.text}
                    </div>
                  )}

                  {el.type === 'rectangle' && (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: el.backgroundColor || el.color || '#CCCCCC',
                        borderRadius: `${el.borderRadius || 0}px`,
                      }}
                    />
                  )}

                  {el.type === 'circle' && (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: el.backgroundColor || el.color || '#CCCCCC',
                        borderRadius: '50%',
                      }}
                    />
                  )}

                  {el.type === 'image' && (
                    <img
                      src={el.url}
                      alt={el.name || 'Image'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        pointerEvents: 'none',
                      }}
                    />
                  )}

                  {/* Resize Handles */}
                  {isSelected && (
                    <>
                      <div
                        onMouseDown={(e) => handleHandleMouseDown(e, 'tl', el)}
                        className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-[#2563EB] rounded-full z-40 cursor-nwse-resize shadow"
                      />
                      <div
                        onMouseDown={(e) => handleHandleMouseDown(e, 'tr', el)}
                        className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#2563EB] rounded-full z-40 cursor-nesw-resize shadow"
                      />
                      <div
                        onMouseDown={(e) => handleHandleMouseDown(e, 'bl', el)}
                        className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-[#2563EB] rounded-full z-40 cursor-nesw-resize shadow"
                      />
                      <div
                        onMouseDown={(e) => handleHandleMouseDown(e, 'br', el)}
                        className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#2563EB] rounded-full z-40 cursor-nwse-resize shadow"
                      />
                      
                      {!el.aspectRatioLocked && (
                        <>
                          <div
                            onMouseDown={(e) => handleHandleMouseDown(e, 'r', el)}
                            className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#2563EB] rounded-full z-40 cursor-ew-resize shadow"
                          />
                          <div
                            onMouseDown={(e) => handleHandleMouseDown(e, 'b', el)}
                            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-[#2563EB] rounded-full z-40 cursor-ns-resize shadow"
                          />
                        </>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-white/95 backdrop-blur-md border border-[#E5E7EB] rounded-2xl px-4 py-2 flex items-center gap-4 text-xs shadow-lg text-[#111827]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setScale(s => Math.max(0.4, s - 0.1))}
            className="p-1 text-[#6B7280] hover:text-[#111827] hover:bg-[#F1F5F9] rounded-lg transition cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>

          <span className="font-mono text-xs font-bold text-[#111827] px-2">
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={() => setScale(s => Math.min(1.5, s + 0.1))}
            className="p-1 text-[#6B7280] hover:text-[#111827] hover:bg-[#F1F5F9] rounded-lg transition cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>

          <button
            onClick={() => setScale(1)}
            className="p-1 text-[#6B7280] hover:text-[#111827] hover:bg-[#F1F5F9] rounded-lg transition cursor-pointer ml-1"
            title="Reset Zoom to 100%"
          >
            <Maximize2 size={14} />
          </button>
        </div>

        <div className="w-[1px] h-4 bg-[#E5E7EB]" />

        <button
          onClick={() => setShowGrid(g => !g)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
            showGrid ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/20' : 'text-[#6B7280] hover:bg-[#F1F5F9]'
          }`}
        >
          <Grid size={14} />
          Grid {showGrid ? 'On' : 'Off'}
        </button>

        <div className="w-[1px] h-4 bg-[#E5E7EB]" />

        <span className="font-mono text-[11px] font-bold text-[#6B7280]">
          800 × 600 px
        </span>
      </div>

    </div>
  );
};

export default DesignCanvas;
