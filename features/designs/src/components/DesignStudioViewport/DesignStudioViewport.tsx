import { useCallback, useEffect, useRef } from 'react';
import {
  DesignStudioStore,
  useDesignStudioStore,
} from '../../DesignStudioStore';
import {
  getViewportCenter,
  resetView,
  zoomIn,
  zoomOut,
} from '../viewportActions';
import './DesignStudioViewport.css';

/**
 * Renders the zoomable/pannable viewport that wraps the design canvas area.
 */
export const DesignStudioViewport: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const zoom = useDesignStudioStore((state) => state.zoom);
  const pan = useDesignStudioStore((state) => state.pan);
  const viewportRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const isSpaceHeld = useRef(false);

  // Handle wheel events for zoom and pan
  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();

    const store = DesignStudioStore.getState();

    // Ctrl/Cmd + scroll = zoom toward cursor
    if (event.ctrlKey || event.metaKey) {
      const rect = viewportRef.current?.getBoundingClientRect();

      if (!rect) {
        return;
      }

      // Mouse position relative to the viewport
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // Compute new zoom from scroll delta
      const zoomFactor = 1 - event.deltaY * 0.005;
      const newZoom = store.zoom * zoomFactor;

      store.setZoom(newZoom, { x: mouseX, y: mouseY });

      return;
    }

    // Shift + scroll = horizontal pan
    const deltaX = event.shiftKey ? event.deltaY : event.deltaX;
    const deltaY = event.shiftKey ? 0 : event.deltaY;

    store.setPan(store.pan.x - deltaX, store.pan.y - deltaY);
  }, []);

  // Attach wheel listener with { passive: false } to allow preventDefault
  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    viewport.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      viewport.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  // Handle middle-mouse-drag panning
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      // Middle mouse button or space + left click
      if (event.button === 1 || (event.button === 0 && isSpaceHeld.current)) {
        event.preventDefault();
        isPanning.current = true;

        const store = DesignStudioStore.getState();

        panStart.current = {
          x: event.clientX,
          y: event.clientY,
          panX: store.pan.x,
          panY: store.pan.y,
        };
      }

      // Clear highlight when clicking the viewport background
      if (
        event.target === event.currentTarget ||
        event.target === viewportRef.current?.firstElementChild
      ) {
        DesignStudioStore.getState().clearHighlight();
      }
    },
    [],
  );

  // Global mouse move/up for panning
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isPanning.current) {
        return;
      }

      const newX = panStart.current.panX + (event.clientX - panStart.current.x);
      const newY = panStart.current.panY + (event.clientY - panStart.current.y);

      DesignStudioStore.getState().setPan(newX, newY);
    };

    const handleMouseUp = () => {
      isPanning.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Track space key for space+drag panning, and zoom/reset shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement).tagName;
      const isTextInput =
        tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

      // Space for panning
      if (event.code === 'Space' && !event.repeat && !isTextInput) {
        event.preventDefault();
        isSpaceHeld.current = true;

        return;
      }

      // Don't handle shortcuts when typing in inputs
      if (isTextInput) {
        return;
      }

      // + or = to zoom in
      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        zoomIn();

        return;
      }

      // - to zoom out
      if (event.key === '-') {
        event.preventDefault();
        zoomOut();

        return;
      }

      // 0 to zoom to 100%
      if (event.key === '0') {
        event.preventDefault();
        DesignStudioStore.getState().setZoom(1, getViewportCenter());

        return;
      }

      // H for home (reset view)
      if (event.key === 'h' || event.key === 'H') {
        event.preventDefault();
        resetView();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        isSpaceHeld.current = false;
        isPanning.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Scale the dot grid background with zoom
  const gridSize = 24 * zoom;

  // Fade out the dot grid between 40% and 30% zoom
  const gridOpacity = Math.min(1, Math.max(0, (zoom - 0.3) / 0.1));

  return (
    <div
      ref={viewportRef}
      className="design-studio-viewport"
      style={
        {
          '--grid-size': `${gridSize}px`,
          '--grid-offset-x': `${pan.x}px`,
          '--grid-offset-y': `${pan.y}px`,
          '--grid-opacity': gridOpacity,
        } as React.CSSProperties
      }
      onMouseDown={handleMouseDown}
    >
      <div
        className="design-studio-viewport-transform-layer"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
