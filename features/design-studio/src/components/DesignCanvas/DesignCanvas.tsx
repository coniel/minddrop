import { useCallback, useEffect, useRef, useState } from 'react';
import './DesignCanvas.css';

type ResizeEdge =
  | 'left'
  | 'right'
  | 'bottom'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

interface ResizeState {
  edge: ResizeEdge;
  startX: number;
  startY: number;
  originWidth: number;
  originHeight: number;
  originX: number;
  originY: number;
}

interface CornerHandleProps {
  path: string;
  onMouseDown: (event: React.MouseEvent) => void;
  className: string;
}

const CornerHandle: React.FC<CornerHandleProps> = ({
  path,
  onMouseDown,
  className,
}) => (
  <div
    className={`design-canvas-resize-handle ${className}`}
    onMouseDown={onMouseDown}
  >
    <svg width="25" height="25" overflow="visible">
      <path
        d={path}
        fill="none"
        stroke="var(--border-default)"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export const DesignCanvas: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 800, height: 600 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const resizeState = useRef<ResizeState | null>(null);

  const clampPosition = useCallback(
    (x: number, y: number, canvasWidth?: number, canvasHeight?: number) => {
      const workspace = canvasRef.current?.parentElement;

      if (!workspace || !canvasRef.current) {
        return { x, y };
      }

      const width = canvasWidth ?? canvasRef.current.offsetWidth;
      const height = canvasHeight ?? canvasRef.current.offsetHeight;

      return {
        x: Math.max(0, Math.min(workspace.offsetWidth - width, x)),
        y: Math.max(0, Math.min(workspace.offsetHeight - height, y)),
      };
    },
    [],
  );

  const handleDragHandleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      dragState.current = {
        startX: event.clientX,
        startY: event.clientY,
        originX: position.x,
        originY: position.y,
      };
    },
    [position],
  );

  const handleResizeMouseDown = useCallback(
    (event: React.MouseEvent, edge: ResizeEdge) => {
      event.stopPropagation();

      resizeState.current = {
        edge,
        startX: event.clientX,
        startY: event.clientY,
        originWidth: size.width,
        originHeight: size.height,
        originX: position.x,
        originY: position.y,
      };
    },
    [size, position],
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (dragState.current) {
        const rawX =
          dragState.current.originX +
          (event.clientX - dragState.current.startX);
        const rawY =
          dragState.current.originY +
          (event.clientY - dragState.current.startY);

        setPosition(clampPosition(rawX, rawY));
      }

      if (resizeState.current) {
        const {
          edge,
          startX,
          startY,
          originWidth,
          originHeight,
          originX,
          originY,
        } = resizeState.current;
        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;
        const workspaceWidth =
          canvasRef.current?.parentElement?.offsetWidth ?? Infinity;
        const workspaceHeight =
          canvasRef.current?.parentElement?.offsetHeight ?? Infinity;

        // Anchored edges, the opposite edge from the one being dragged stays fixed.
        const rightEdge = originX + originWidth;
        const bottomEdge = originY + originHeight;

        switch (edge) {
          case 'right': {
            const newWidth = Math.min(
              Math.max(200, originWidth + deltaX),
              workspaceWidth - originX,
            );

            setSize((current) => ({ ...current, width: newWidth }));
            break;
          }

          case 'left': {
            const newX = Math.max(
              0,
              Math.min(rightEdge - 200, originX + deltaX),
            );

            setSize((current) => ({ ...current, width: rightEdge - newX }));
            setPosition((current) => ({ ...current, x: newX }));
            break;
          }

          case 'bottom': {
            const newHeight = Math.min(
              Math.max(100, originHeight + deltaY),
              workspaceHeight - originY,
            );

            setSize((current) => ({ ...current, height: newHeight }));
            break;
          }

          case 'top-left': {
            const newX = Math.max(
              0,
              Math.min(rightEdge - 200, originX + deltaX),
            );
            const newY = Math.max(
              0,
              Math.min(bottomEdge - 100, originY + deltaY),
            );

            setSize({ width: rightEdge - newX, height: bottomEdge - newY });
            setPosition({ x: newX, y: newY });
            break;
          }

          case 'top-right': {
            const newWidth = Math.min(
              Math.max(200, originWidth + deltaX),
              workspaceWidth - originX,
            );
            const newY = Math.max(
              0,
              Math.min(bottomEdge - 100, originY + deltaY),
            );

            setSize({ width: newWidth, height: bottomEdge - newY });
            setPosition((current) => ({ ...current, y: newY }));
            break;
          }

          case 'bottom-left': {
            const newX = Math.max(
              0,
              Math.min(rightEdge - 200, originX + deltaX),
            );
            const newHeight = Math.min(
              Math.max(100, originHeight + deltaY),
              workspaceHeight - originY,
            );

            setSize({ width: rightEdge - newX, height: newHeight });
            setPosition((current) => ({ ...current, x: newX }));
            break;
          }

          case 'bottom-right': {
            const newWidth = Math.min(
              Math.max(200, originWidth + deltaX),
              workspaceWidth - originX,
            );
            const newHeight = Math.min(
              Math.max(100, originHeight + deltaY),
              workspaceHeight - originY,
            );

            setSize({ width: newWidth, height: newHeight });
            break;
          }
        }
      }
    },
    [clampPosition],
  );

  const handleMouseUp = useCallback(() => {
    dragState.current = null;
    resizeState.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={canvasRef}
      className="design-canvas"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: size.width,
      }}
    >
      <div className="design-canvas-hover-zone design-canvas-hover-zone-top-left" />
      <div className="design-canvas-hover-zone design-canvas-hover-zone-top-left-vertical" />
      <CornerHandle
        className="design-canvas-resize-handle-top-left"
        path="M 25 0 A 25 25 0 0 0 0 25"
        onMouseDown={(event) => handleResizeMouseDown(event, 'top-left')}
      />
      <div className="design-canvas-hover-zone design-canvas-hover-zone-top-right" />
      <div className="design-canvas-hover-zone design-canvas-hover-zone-top-right-vertical" />
      <CornerHandle
        className="design-canvas-resize-handle-top-right"
        path="M 0 0 A 25 25 0 0 1 25 25"
        onMouseDown={(event) => handleResizeMouseDown(event, 'top-right')}
      />
      <div className="design-canvas-hover-zone design-canvas-hover-zone-bottom-left" />
      <div className="design-canvas-hover-zone design-canvas-hover-zone-bottom-left-vertical" />
      <CornerHandle
        className="design-canvas-resize-handle-bottom-left"
        path="M 25 25 A 25 25 0 0 1 0 0"
        onMouseDown={(event) => handleResizeMouseDown(event, 'bottom-left')}
      />
      <div className="design-canvas-hover-zone design-canvas-hover-zone-bottom-right" />
      <div className="design-canvas-hover-zone design-canvas-hover-zone-bottom-right-vertical" />
      <CornerHandle
        className="design-canvas-resize-handle-bottom-right"
        path="M 0 25 A 25 25 0 0 0 25 0"
        onMouseDown={(event) => handleResizeMouseDown(event, 'bottom-right')}
      />
      <div className="design-canvas-hover-zone design-canvas-hover-zone-top" />
      <div
        className="design-canvas-drag-handle"
        onMouseDown={handleDragHandleMouseDown}
      />
      <div className="design-canvas-content" style={{ height: size.height }} />
      <div className="design-canvas-hover-zone design-canvas-hover-zone-left" />
      <div
        className="design-canvas-resize-handle design-canvas-resize-handle-left"
        onMouseDown={(event) => handleResizeMouseDown(event, 'left')}
      />
      <div className="design-canvas-hover-zone design-canvas-hover-zone-right" />
      <div
        className="design-canvas-resize-handle design-canvas-resize-handle-right"
        onMouseDown={(event) => handleResizeMouseDown(event, 'right')}
      />
      <div className="design-canvas-hover-zone design-canvas-hover-zone-bottom" />
      <div
        className="design-canvas-resize-handle design-canvas-resize-handle-bottom"
        onMouseDown={(event) => handleResizeMouseDown(event, 'bottom')}
      />
    </div>
  );
};
