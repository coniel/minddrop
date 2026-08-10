import { useCallback, useEffect, useRef } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { CanvasAlignmentGuides } from '../CanvasAlignmentGuides';
import { useCanvasContext } from '../CanvasContext';
import { CanvasNameField } from '../CanvasNameField';
import { CONNECTION_PROXIMITY, GRID_SIZE } from '../constants';
import { CanvasPoint } from '../types';
import { useCanvasStore } from '../useCanvasStore';
import { getConnectionHandleTarget, screenToCanvas } from '../utils';
import './Canvas.css';

export interface CanvasBackgroundOptions {
  /**
   * The background pattern rendered behind the canvas content.
   */
  type: 'dots' | 'none';
}

export interface CanvasProps {
  /**
   * The canvas content, rendered inside the transform layer in
   * canvas coordinates.
   */
  children: React.ReactNode;

  /**
   * Optional additional class name for the viewport element.
   */
  className?: string;

  /**
   * The canvas's name, shown in an editable field at the top
   * left of the viewport. The field is omitted when no name is
   * given.
   */
  name?: string;

  /**
   * The placeholder shown while the name field is empty.
   */
  namePlaceholder?: TranslationKey;

  /**
   * Called with the new name when a name edit is committed.
   */
  onNameChange?: (name: string) => void;

  /**
   * The canvas background configuration. Defaults to a dot grid.
   */
  background?: CanvasBackgroundOptions;

  /**
   * Called when the empty canvas background is pressed (not a
   * node or other content).
   * @param event - The mouse event.
   * @param canvasPoint - The pressed point in canvas coordinates.
   */
  onBackgroundMouseDown?: (
    event: React.MouseEvent<HTMLDivElement>,
    canvasPoint: CanvasPoint,
  ) => void;

  /**
   * Called when data is dropped onto the canvas.
   * @param event - The drag event.
   * @param canvasPoint - The drop point in canvas coordinates.
   */
  onDrop?: (
    event: React.DragEvent<HTMLDivElement>,
    canvasPoint: CanvasPoint,
  ) => void;

  /**
   * Called when data is dragged over the canvas. Call
   * preventDefault to allow dropping.
   */
  onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;

  /**
   * How keyboard shortcuts (space pan, zoom keys) are scoped:
   * 'focus' (default) handles keys only while focus is within the
   * viewport, 'window' listens globally for full-screen canvases,
   * 'none' disables shortcuts.
   */
  shortcutScope?: 'window' | 'focus' | 'none';
}

/**
 * Renders the zoomable/pannable viewport that wraps a canvas
 * instance's content. Must be rendered within a CanvasProvider.
 */
export const Canvas: React.FC<CanvasProps> = ({
  children,
  className,
  name,
  namePlaceholder,
  onNameChange,
  background = { type: 'dots' },
  onBackgroundMouseDown,
  onDrop,
  onDragOver,
  shortcutScope = 'focus',
}) => {
  const { store, viewportRef, transformLayerRef } = useCanvasContext();
  const zoom = useCanvasStore((state) => state.zoom);
  const pan = useCanvasStore((state) => state.pan);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const isSpaceHeld = useRef(false);

  /**
   * Converts a point in client coordinates to canvas coordinates.
   */
  const clientToCanvas = useCallback(
    (clientX: number, clientY: number): CanvasPoint => {
      const rect = viewportRef.current?.getBoundingClientRect();

      // Make the point viewport-relative before undoing the transform
      return screenToCanvas(
        {
          x: clientX - (rect?.left || 0),
          y: clientY - (rect?.top || 0),
        },
        store.getPan(),
        store.getZoom(),
      );
    },
    [store, viewportRef],
  );

  // Handle wheel events for zoom and pan
  const handleWheel = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();

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
        const newZoom = store.getZoom() * zoomFactor;

        store.setZoom(newZoom, { x: mouseX, y: mouseY });

        return;
      }

      // Shift + scroll = horizontal pan
      const deltaX = event.shiftKey ? event.deltaY : event.deltaX;
      const deltaY = event.shiftKey ? 0 : event.deltaY;
      const currentPan = store.getPan();

      store.setPan(currentPan.x - deltaX, currentPan.y - deltaY);
    },
    [store, viewportRef],
  );

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
  }, [handleWheel, viewportRef]);

  // Keep the measured viewport size in the store for fit and
  // centering math
  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const measure = () => {
      store.setViewportSize({
        width: viewport.offsetWidth,
        height: viewport.offsetHeight,
      });
    };

    // Initial measure before the first observer callback
    measure();

    const observer = new ResizeObserver(measure);

    observer.observe(viewport);

    return () => {
      observer.disconnect();
    };
  }, [store, viewportRef]);

  // Handle pan-drag starts and background presses
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      // Middle mouse button or space + left click starts panning
      if (event.button === 1 || (event.button === 0 && isSpaceHeld.current)) {
        event.preventDefault();
        isPanning.current = true;

        const currentPan = store.getPan();

        panStart.current = {
          x: event.clientX,
          y: event.clientY,
          panX: currentPan.x,
          panY: currentPan.y,
        };

        return;
      }

      // Focus the viewport so focus-scoped shortcuts receive keys
      if (shortcutScope === 'focus') {
        viewportRef.current?.focus({ preventScroll: true });
      }

      const target = event.target as HTMLElement;

      // Presses on content rendered within the canvas are handled
      // by the content itself
      if (
        target !== event.currentTarget &&
        target !== transformLayerRef.current
      ) {
        return;
      }

      // Pressing the empty canvas background deselects
      store.clearSelection();

      if (onBackgroundMouseDown) {
        onBackgroundMouseDown(
          event,
          clientToCanvas(event.clientX, event.clientY),
        );
      }
    },
    [
      store,
      viewportRef,
      transformLayerRef,
      shortcutScope,
      onBackgroundMouseDown,
      clientToCanvas,
    ],
  );

  // Track the cursor's proximity to node edges, revealing the
  // nearby edge's connection handle. Viewport-level tracking so
  // edges are detected from outside their node as well.
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const point = clientToCanvas(event.clientX, event.clientY);

      // The proximity threshold is in screen pixels, so it is
      // unscaled into canvas units
      store.setHoveredConnectionHandle(
        getConnectionHandleTarget(
          store.getNodes(),
          point,
          CONNECTION_PROXIMITY / store.getZoom(),
        ),
      );
    },
    [store, clientToCanvas],
  );

  // Hide the connection handle when the cursor leaves the canvas
  const handleMouseLeave = useCallback(() => {
    store.setHoveredConnectionHandle(null);
  }, [store]);

  // Global mouse move/up for panning
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isPanning.current) {
        return;
      }

      const newX = panStart.current.panX + (event.clientX - panStart.current.x);
      const newY = panStart.current.panY + (event.clientY - panStart.current.y);

      store.setPan(newX, newY);
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
  }, [store]);

  // Track space key for space+drag panning, and zoom/fit shortcuts
  const processKeyDown = useCallback(
    (event: KeyboardEvent | React.KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const tag = target.tagName;
      const isTextInput =
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        target.isContentEditable;

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

      // Escape clears the selection
      if (event.key === 'Escape') {
        store.clearSelection();

        return;
      }

      // Cmd/Ctrl + A selects every node on the canvas
      if (event.key === 'a' && (event.metaKey || event.ctrlKey)) {
        // Leave the shortcut to the app when the canvas does not
        // support selection
        if (!store.getSelectable()) {
          return;
        }

        event.preventDefault();
        store.selectNodes(Object.keys(store.getNodes()));

        return;
      }

      // + or = to zoom in
      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        store.zoomIn();

        return;
      }

      // - to zoom out
      if (event.key === '-') {
        event.preventDefault();
        store.zoomOut();

        return;
      }

      // 0 to zoom to 100%
      if (event.key === '0') {
        event.preventDefault();

        const viewportSize = store.getViewportSize();

        store.setZoom(1, {
          x: viewportSize.width / 2,
          y: viewportSize.height / 2,
        });

        return;
      }

      // H for home (fit all nodes in view)
      if (event.key === 'h' || event.key === 'H') {
        event.preventDefault();
        store.fitToView();
      }
    },
    [store],
  );

  // Release space panning on keyup
  const processKeyUp = useCallback(
    (event: KeyboardEvent | React.KeyboardEvent) => {
      if (event.code === 'Space') {
        isSpaceHeld.current = false;
        isPanning.current = false;
      }
    },
    [],
  );

  // Window scope: listen for shortcuts globally
  useEffect(() => {
    if (shortcutScope !== 'window') {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => processKeyDown(event);
    const handleKeyUp = (event: KeyboardEvent) => processKeyUp(event);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [shortcutScope, processKeyDown, processKeyUp]);

  // Focus scope: handle shortcuts while focus is within the viewport
  const handleReactKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      processKeyDown(event);
    },
    [processKeyDown],
  );

  const handleReactKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      processKeyUp(event);
    },
    [processKeyUp],
  );

  // Release space panning when focus leaves the viewport
  const handleBlur = useCallback(() => {
    isSpaceHeld.current = false;
    isPanning.current = false;
  }, []);

  // Wrap drops to include the drop point in canvas coordinates
  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      if (onDrop) {
        onDrop(event, clientToCanvas(event.clientX, event.clientY));
      }
    },
    [onDrop, clientToCanvas],
  );

  // Scale the dot grid background with zoom
  const gridSize = GRID_SIZE * zoom;

  // Fade out the dot grid between 40% and 30% zoom
  const gridOpacity = Math.min(1, Math.max(0, (zoom - 0.3) / 0.1));

  const focusScoped = shortcutScope === 'focus';

  return (
    <div
      ref={viewportRef}
      className={`ui-canvas-viewport${
        background.type === 'dots' ? ' ui-canvas-viewport-dots' : ''
      }${className ? ` ${className}` : ''}`}
      style={
        {
          '--ui-canvas-grid-size': `${gridSize}px`,
          '--ui-canvas-grid-offset-x': `${pan.x}px`,
          '--ui-canvas-grid-offset-y': `${pan.y}px`,
          '--ui-canvas-grid-opacity': gridOpacity,
        } as React.CSSProperties
      }
      tabIndex={focusScoped ? -1 : undefined}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onKeyDown={focusScoped ? handleReactKeyDown : undefined}
      onKeyUp={focusScoped ? handleReactKeyUp : undefined}
      onBlur={focusScoped ? handleBlur : undefined}
      onDragOver={onDragOver}
      onDrop={onDrop ? handleDrop : undefined}
    >
      <div
        ref={transformLayerRef}
        className="ui-canvas-transform-layer"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        {children}

        {/* Snapping alignment guides */}
        <CanvasAlignmentGuides />
      </div>

      {/* Editable canvas name */}
      {name !== undefined && (
        <CanvasNameField
          name={name}
          placeholder={namePlaceholder}
          onNameChange={onNameChange}
        />
      )}
    </div>
  );
};
