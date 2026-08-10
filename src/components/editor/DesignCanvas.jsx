import React, { useRef, useState, useEffect } from 'react';

const DesignCanvas = ({ elements, selectedId, setSelectedId, updateElements }) => {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [dragState, setDragState] = useState(null);

  // Resize canvas scale factor based on container width
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        const parent = canvasRef.current.parentElement;
        const scaleX = parent.clientWidth / 820; // 10px padding on each side
        const scaleY = parent.clientHeight / 620;
        const newScale = Math.max(0.4, Math.min(scaleX, scaleY, 1));
        setScale(newScale);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCanvasClick = (e) => {
    // Select canvas background to clear selection
    if (e.target === canvasRef.current || e.target.classList.contains('grid-bg')) {
      setSelectedId(null);
    }
  };

  const handleElementMouseDown = (e, element) => {
    e.stopPropagation();
    setSelectedId(element.id);

    const canvasRect = canvasRef.current.getBoundingClientRect();
    // Record starting positions in logical coordinate space (800x600)
    const clientX = e.clientX;
    const clientY = e.clientY;

    setDragState({
      type: 'move',
      elementId: element.id,
      startX: element.x,
      startY: element.y,
      startMouseX: clientX,
      startMouseY: clientY,
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

      // Calculate shift delta, adjusting for canvas zoom scaling factor
      const deltaX = (e.clientX - dragState.startMouseX) / scale;
      const deltaY = (e.clientY - dragState.startMouseY) / scale;

      let newElements = elements.map(el => {
        if (el.id !== element.id) return el;

        if (dragState.type === 'move') {
          // Snap position or keep boundary inside 800x600
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
    <div className="w-full h-full flex items-center justify-center overflow-auto p-4 bg-[#14151a]">
      {/* Outer sizing box */}
      <div 
        style={{ width: 800, height: 600, transform: `scale(${scale})`, transformOrigin: 'center center' }} 
        className="shrink-0 relative transition-transform duration-75 shadow-2xl"
      >
        {/* Logical Canvas Workspace */}
        <div
          ref={canvasRef}
          onClick={handleCanvasClick}
          style={{ width: 800, height: 600 }}
          className="absolute inset-0 bg-white border border-gray-700 overflow-hidden select-none grid-bg cursor-default"
        >
          {/* Subtle Grid Dotted CSS Background */}
          <div className="absolute inset-0 pointer-events-none grid-bg opacity-30"></div>

          {elements.map((el) => {
            const isSelected = selectedId === el.id;
            
            // Common styles for positions
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
                className={`relative group ${isSelected ? 'ring-2 ring-indigo-500 z-30' : 'hover:ring-1 hover:ring-indigo-300/50 z-10'}`}
              >
                {/* Element Renderers */}
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
                      backgroundColor: el.color || '#cccccc',
                      borderRadius: `${el.borderRadius || 0}px`,
                    }}
                  ></div>
                )}

                {el.type === 'circle' && (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: el.color || '#cccccc',
                      borderRadius: '50%',
                    }}
                  ></div>
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

                {/* Resize Handles (rendered only when selected) */}
                {isSelected && (
                  <>
                    {/* Corner Handles */}
                    <div
                      onMouseDown={(e) => handleHandleMouseDown(e, 'tl', el)}
                      className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-full z-40 cursor-nwse-resize shadow"
                    />
                    <div
                      onMouseDown={(e) => handleHandleMouseDown(e, 'tr', el)}
                      className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-full z-40 cursor-nesw-resize shadow"
                    />
                    <div
                      onMouseDown={(e) => handleHandleMouseDown(e, 'bl', el)}
                      className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-full z-40 cursor-nesw-resize shadow"
                    />
                    <div
                      onMouseDown={(e) => handleHandleMouseDown(e, 'br', el)}
                      className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-600 rounded-full z-40 cursor-nwse-resize shadow"
                    />
                    
                    {/* Edge Midpoint Handles (Only for non-locked shapes) */}
                    {!el.aspectRatioLocked && (
                      <>
                        <div
                          onMouseDown={(e) => handleHandleMouseDown(e, 'r', el)}
                          className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-2 border-indigo-600 rounded-full z-40 cursor-ew-resize shadow"
                        />
                        <div
                          onMouseDown={(e) => handleHandleMouseDown(e, 'b', el)}
                          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-indigo-600 rounded-full z-40 cursor-ns-resize shadow"
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

      <style>{`
        .grid-bg {
          background-size: 20px 20px;
          background-image: radial-gradient(circle, #e2e8f0 1.5px, transparent 1.5px);
        }
      `}</style>
    </div>
  );
};

export default DesignCanvas;
