import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DevToolsUiState } from '../DevToolsUiState';
import { setDevToolsWindowRect } from '../setDevToolsWindowRect';
import { DevToolsWindowRect, DevToolsWindowResizeEdge } from '../types';
import { clampWindowRect, getResizedWindowRect } from '../utils';
import './DevToolsWindow.css';

const ResizeEdges: DevToolsWindowResizeEdge[] = [
  'n',
  's',
  'e',
  'w',
  'ne',
  'nw',
  'se',
  'sw',
];

export interface DevToolsWindowProps {
  /**
   * Content rendered in the window's draggable header.
   */
  header: React.ReactNode;

  /**
   * The window's body content.
   */
  children: React.ReactNode;
}

/**
 * Renders the dev tools as a floating window which can be
 * moved and resized.
 */
export const DevToolsWindow: React.FC<DevToolsWindowProps> = ({
  header,
  children,
}) => {
  const [dragRect, setDragRect] = useState<DevToolsWindowRect | null>(null);
  const x = DevToolsUiState.useValue('windowX');
  const y = DevToolsUiState.useValue('windowY');
  const width = DevToolsUiState.useValue('windowWidth');
  const height = DevToolsUiState.useValue('windowHeight');

  // While dragging, the window follows the transient drag rect so
  // that the persisted rect is only written once the drag ends
  const rect = useMemo(
    () => dragRect ?? { x, y, width, height },
    [dragRect, x, y, width, height],
  );

  // Confine the window to the app window on mount and whenever the
  // app window is resized, in case it no longer fits
  useEffect(() => {
    const confineToViewport = () => {
      const confined = clampWindowRect({ x, y, width, height }, getViewport());

      // Only write when the window actually moved or shrunk
      if (
        confined.x !== x ||
        confined.y !== y ||
        confined.width !== width ||
        confined.height !== height
      ) {
        setDevToolsWindowRect(confined);
      }
    };

    confineToViewport();

    window.addEventListener('resize', confineToViewport);

    return () => window.removeEventListener('resize', confineToViewport);
  }, [x, y, width, height]);

  const beginDrag = useCallback(
    (
      event: React.MouseEvent,
      getRect: (delta: { x: number; y: number }) => DevToolsWindowRect,
    ) => {
      event.preventDefault();

      const start = { x: event.clientX, y: event.clientY };
      let latestRect = rect;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        latestRect = getRect({
          x: moveEvent.clientX - start.x,
          y: moveEvent.clientY - start.y,
        });

        setDragRect(latestRect);
      };

      const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);

        setDragRect(null);
        setDevToolsWindowRect(latestRect);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [rect],
  );

  const handleMoveStart = useCallback(
    (event: React.MouseEvent) => {
      // Let header buttons handle their own clicks
      if ((event.target as HTMLElement).closest('button')) {
        return;
      }

      beginDrag(event, (delta) =>
        clampWindowRect(
          { ...rect, x: rect.x + delta.x, y: rect.y + delta.y },
          getViewport(),
        ),
      );
    },
    [beginDrag, rect],
  );

  const handleResizeStart = useCallback(
    (event: React.MouseEvent, edge: DevToolsWindowResizeEdge) => {
      event.stopPropagation();

      beginDrag(event, (delta) =>
        getResizedWindowRect(rect, edge, delta, getViewport()),
      );
    },
    [beginDrag, rect],
  );

  return (
    <div
      className="dev-tools-window"
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
      }}
    >
      {/* --- Resize edges --- */}
      {ResizeEdges.map((edge) => (
        <DevToolsWindowResizeHandle
          key={edge}
          edge={edge}
          onResizeStart={handleResizeStart}
        />
      ))}

      {/* --- Header --- */}
      <div className="dev-tools-window-header" onMouseDown={handleMoveStart}>
        {header}
      </div>

      {children}
    </div>
  );
};

/**
 * Returns the app window's inner size.
 */
function getViewport(): { width: number; height: number } {
  return { width: window.innerWidth, height: window.innerHeight };
}

interface DevToolsWindowResizeHandleProps {
  /**
   * The window edge the handle resizes.
   */
  edge: DevToolsWindowResizeEdge;

  /**
   * Callback fired when the handle is pressed.
   */
  onResizeStart: (
    event: React.MouseEvent,
    edge: DevToolsWindowResizeEdge,
  ) => void;
}

/**
 * Renders the drag target for one of the window's resize edges.
 */
const DevToolsWindowResizeHandle: React.FC<DevToolsWindowResizeHandleProps> = ({
  edge,
  onResizeStart,
}) => {
  const handleMouseDown = (event: React.MouseEvent) => {
    onResizeStart(event, edge);
  };

  return (
    <div
      className={`dev-tools-window-resize-handle dev-tools-window-resize-${edge}`}
      onMouseDown={handleMouseDown}
    />
  );
};
