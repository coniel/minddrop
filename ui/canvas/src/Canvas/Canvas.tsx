import { useCallback, useEffect, useRef, useState } from 'react';
import { TranslationKey } from '@minddrop/i18n';
import { CanvasAlignmentGuides } from '../CanvasAlignmentGuides';
import { useCanvasContext } from '../CanvasContext';
import { CanvasLasso } from '../CanvasLasso';
import { CanvasNameField } from '../CanvasNameField';
import { CanvasSelectionBox } from '../CanvasSelectionBox';
import { CanvasSelectionToolbar } from '../CanvasSelectionToolbar';
import {
  CONNECTION_PROXIMITY,
  GRID_SIZE,
  LASSO_DRAG_THRESHOLD,
} from '../constants';
import { CanvasNodeFrame, CanvasPoint, CanvasSelection } from '../types';
import { useCanvasStore } from '../useCanvasStore';
import { useInteractionLock } from '../useInteractionLock';
import {
  framesIntersect,
  getConnectionHandleTarget,
  getFrameFromPoints,
  screenToCanvas,
} from '../utils';
import './Canvas.css';

export interface CanvasSelectionDeleteOptions {
  /**
   * Whether shift was held, which consumers may treat as a
   * stronger form of deletion than the plain press.
   */
  shiftKey: boolean;
}

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
   * Called when a mouse press is released over the empty canvas
   * background (not a node or other content).
   * @param event - The mouse event.
   * @param canvasPoint - The release point in canvas coordinates.
   */
  onBackgroundMouseUp?: (
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
   * Called when a drag leaves the canvas or one of its child
   * elements. Check relatedTarget to tell the two apart.
   */
  onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void;

  /**
   * Whether dragging from the empty canvas background paints a
   * selection lasso. Defaults to true.
   */
  lasso?: boolean;

  /**
   * Called once with the final frames of every node moved by a
   * multi-selection group drag. Group drags report through this
   * instead of each node's own onFrameChange, so the moved nodes
   * can be applied in a single update.
   */
  onNodesFrameChange?: (frames: Record<string, CanvasNodeFrame>) => void;

  /**
   * Returns the contents of the toolbar floating above the
   * current selection. Called for any non-empty selection, so
   * nodes and connections can render different toolbars.
   */
  selectionToolbar?: (selection: CanvasSelection) => React.ReactNode;

  /**
   * Called when Delete or Backspace is pressed with a selection.
   * Deleting is the consumer's job, since only it knows what the
   * selected IDs stand for.
   */
  onSelectionDelete?: (
    selection: CanvasSelection,
    options: CanvasSelectionDeleteOptions,
  ) => void;

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
  onBackgroundMouseUp,
  onDrop,
  onDragOver,
  onDragLeave,
  lasso = true,
  onNodesFrameChange,
  selectionToolbar,
  onSelectionDelete,
  shortcutScope = 'focus',
}) => {
  const { store, viewportRef, transformLayerRef } = useCanvasContext();
  const zoom = useCanvasStore((state) => state.zoom);
  const pan = useCanvasStore((state) => state.pan);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const isSpaceHeld = useRef(false);
  const lassoStart = useRef<LassoStart | null>(null);
  // Mirrors the panning ref for the interaction lock, which the
  // ref alone cannot drive since it does not re-render
  const [panning, setPanning] = useState(false);
  const lassoDrag = useCanvasStore((state) => state.lasso);

  // Hold the pointer while the canvas itself is being dragged, so
  // panning and lassoing over text neither select it nor swap the
  // cursor
  useInteractionLock(getCanvasCursor(panning, Boolean(lassoDrag)));

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
      // Let scrollable content inside the canvas consume plain
      // scrolls, zoom gestures still target the canvas
      if (
        !event.ctrlKey &&
        !event.metaKey &&
        viewportRef.current &&
        scrollsNestedContent(event, viewportRef.current)
      ) {
        return;
      }

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
        setPanning(true);

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

      // A left press on the background arms a selection lasso.
      // Clearing the selection is deferred to mouse up, where a
      // press that never dragged deselects.
      if (lasso && event.button === 0 && store.getSelectable()) {
        // Keep the browser from starting a text selection anchored
        // at the press. It has to happen here: a selection already
        // under way carries on painting regardless of the content
        // the marquee is dragged across being unselectable.
        event.preventDefault();

        // Suppressing the default also suppresses the focus move
        // it would have made. Focus-scoped canvases took focus to
        // the viewport above; others have no focusable viewport,
        // so focused content is blurred instead.
        if (
          shortcutScope !== 'focus' &&
          document.activeElement instanceof HTMLElement
        ) {
          document.activeElement.blur();
        }

        lassoStart.current = {
          clientX: event.clientX,
          clientY: event.clientY,
          origin: clientToCanvas(event.clientX, event.clientY),
          additive: event.shiftKey,
          baselineNodeIds: store.getSelectedNodeIds(),
          baselineConnectionIds: store.getSelectedConnectionIds(),
        };
      } else {
        // Pressing the empty canvas background deselects
        store.clearSelection();
      }

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
      lasso,
    ],
  );

  // Report presses released over the empty canvas background
  const handleMouseUp = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;

      // Releasing over the empty canvas background (the viewport
      // itself or the transform layer, not content rendered within)
      if (
        onBackgroundMouseUp &&
        (target === event.currentTarget || target === transformLayerRef.current)
      ) {
        onBackgroundMouseUp(
          event,
          clientToCanvas(event.clientX, event.clientY),
        );
      }
    },
    [transformLayerRef, onBackgroundMouseUp, clientToCanvas],
  );

  // Track the cursor's proximity to node edges, revealing the
  // nearby edge's connection handle. Viewport-level tracking so
  // edges are detected from outside their node as well.
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      // A marquee sweeping past a node's edges is not reaching
      // for its connection handles
      if (store.getLasso()) {
        store.setHoveredConnectionHandle(null);

        return;
      }

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

  // Select everything the marquee touches: nodes when it touches
  // any, and connections only when it touches no node at all
  const applyLassoSelection = useCallback(
    (frame: CanvasNodeFrame, start: LassoStart) => {
      const nodes = store.getNodes();

      // The nodes the marquee overlaps
      const nodeIds = Object.keys(nodes).filter((nodeId) =>
        framesIntersect(nodes[nodeId], frame),
      );

      // An additive lasso adds to the selection as it was when
      // the drag started, so shrinking the marquee still drops
      // the nodes it no longer touches
      const selectedNodeIds = start.additive
        ? mergeIds(start.baselineNodeIds, nodeIds)
        : nodeIds;

      // Nodes take precedence, so a mixed sweep selects only them
      if (selectedNodeIds.length) {
        store.selectNodes(selectedNodeIds);

        return;
      }

      const connectionIds = store.hitTestConnections(frame);
      const selectedConnectionIds = start.additive
        ? mergeIds(start.baselineConnectionIds, connectionIds)
        : connectionIds;

      if (selectedConnectionIds.length) {
        store.selectConnections(selectedConnectionIds);

        return;
      }

      // The marquee touches nothing
      store.clearSelection();
    },
    [store],
  );

  // Global mouse move/up for panning and lasso selection
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isPanning.current) {
        const newX =
          panStart.current.panX + (event.clientX - panStart.current.x);
        const newY =
          panStart.current.panY + (event.clientY - panStart.current.y);

        store.setPan(newX, newY);

        return;
      }

      const start = lassoStart.current;

      // No lasso is armed
      if (!start) {
        return;
      }

      // The lasso only starts once the press travels past the
      // threshold, leaving a plain background click a click
      if (!store.getLasso()) {
        const distance = Math.hypot(
          event.clientX - start.clientX,
          event.clientY - start.clientY,
        );

        if (distance < LASSO_DRAG_THRESHOLD) {
          return;
        }

        store.startLasso(start.origin, start.additive);
      }

      const point = clientToCanvas(event.clientX, event.clientY);

      store.updateLasso(point);
      applyLassoSelection(getFrameFromPoints(start.origin, point), start);
    };

    const handleMouseUp = () => {
      isPanning.current = false;
      setPanning(false);

      const start = lassoStart.current;

      lassoStart.current = null;

      // No lasso was armed
      if (!start) {
        return;
      }

      // A press that never crossed the threshold deselects,
      // except when it was a shift press adding to the selection
      if (!store.getLasso()) {
        if (!start.additive) {
          store.clearSelection();
        }

        return;
      }

      // Anchor the lasso's selection where the drag was released
      const release = store.getLasso()?.point;

      if (release && store.getSelection()) {
        store.setSelectionPoint(release);
      }

      store.clearLasso();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [store, clientToCanvas, applyLassoSelection]);

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

      // Delete removes the selection through the consumer, which
      // owns whatever the selected IDs stand for
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const selection = store.getSelection();

        if (!selection || !onSelectionDelete) {
          return;
        }

        // Stopped as well as prevented, so an app-level delete
        // shortcut does not act on the same press
        event.preventDefault();
        event.stopPropagation();

        onSelectionDelete(selection, { shiftKey: event.shiftKey });

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
    [store, onSelectionDelete],
  );

  // Release space panning on keyup
  const processKeyUp = useCallback(
    (event: KeyboardEvent | React.KeyboardEvent) => {
      if (event.code === 'Space') {
        isSpaceHeld.current = false;
        isPanning.current = false;
        setPanning(false);
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
    setPanning(false);
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
      onMouseUp={onBackgroundMouseUp ? handleMouseUp : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onKeyDown={focusScoped ? handleReactKeyDown : undefined}
      onKeyUp={focusScoped ? handleReactKeyUp : undefined}
      onBlur={focusScoped ? handleBlur : undefined}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
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

        {/* Drag-to-select marquee */}
        <CanvasLasso />

        {/* Multi-selection group box, above the nodes it wraps */}
        <CanvasSelectionBox onNodesFrameChange={onNodesFrameChange} />
      </div>

      {/* Editable canvas name */}
      {name !== undefined && (
        <CanvasNameField
          name={name}
          placeholder={namePlaceholder}
          onNameChange={onNameChange}
        />
      )}

      {/* Consumer-supplied toolbar floating above the selection */}
      {selectionToolbar && (
        <CanvasSelectionToolbar renderToolbar={selectionToolbar} />
      )}
    </div>
  );
};

/**
 * An armed lasso drag: where the press started and the selection
 * it builds on.
 */
interface LassoStart {
  /**
   * The press's horizontal position in client coordinates, for
   * measuring travel against the drag threshold.
   */
  clientX: number;

  /**
   * The press's vertical position in client coordinates.
   */
  clientY: number;

  /**
   * The press point in canvas coordinates, the marquee's fixed
   * corner.
   */
  origin: CanvasPoint;

  /**
   * Whether the lasso adds to the selection that existed when the
   * press started.
   */
  additive: boolean;

  /**
   * The nodes selected when the press started, which an additive
   * lasso adds to.
   */
  baselineNodeIds: string[];

  /**
   * The connections selected when the press started, which an
   * additive lasso adds to.
   */
  baselineConnectionIds: string[];
}

/**
 * Returns the cursor held for the duration of a canvas drag, or
 * null when the canvas itself is not being dragged.
 */
function getCanvasCursor(panning: boolean, lassoing: boolean): string | null {
  if (panning) {
    return 'grabbing';
  }

  // The lasso leaves the pointer as it is, only stopping content
  // it sweeps over from swapping the cursor
  if (lassoing) {
    return 'default';
  }

  return null;
}

/**
 * Merges two lists of IDs, dropping duplicates.
 */
function mergeIds(baseline: string[], ids: string[]): string[] {
  return Array.from(new Set([...baseline, ...ids]));
}

/**
 * Checks whether a wheel event can be consumed by a scrollable
 * element between its target and the canvas viewport, in the
 * direction of the scroll.
 */
function scrollsNestedContent(
  event: WheelEvent,
  viewport: HTMLElement,
): boolean {
  let element = event.target instanceof HTMLElement ? event.target : null;

  // Walk up from the target to the canvas viewport
  while (element && element !== viewport) {
    const { overflowX, overflowY } = getComputedStyle(element);

    // The element scrolls vertically under the wheel's vertical
    // delta
    if (
      event.deltaY !== 0 &&
      (overflowY === 'auto' || overflowY === 'scroll') &&
      element.scrollHeight > element.clientHeight
    ) {
      return true;
    }

    // The element scrolls horizontally under the wheel's
    // horizontal delta
    if (
      event.deltaX !== 0 &&
      (overflowX === 'auto' || overflowX === 'scroll') &&
      element.scrollWidth > element.clientWidth
    ) {
      return true;
    }

    element = element.parentElement;
  }

  return false;
}
