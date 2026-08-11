import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { isInteractiveTarget } from '@minddrop/utils';
import { CanvasContextValue, useOptionalCanvasContext } from '../CanvasContext';
import {
  NODE_MIN_HEIGHT,
  NODE_MIN_WIDTH,
  OBJECT_SNAP_DISTANCE,
} from '../constants';
import {
  CanvasNodeFrame,
  CanvasNodeResizeEdge,
  CanvasNodeResizeState,
} from '../types';
import { useInteractionLock } from '../useInteractionLock';
import {
  getResizedNodeFrame,
  getSnappedNodePosition,
  getSnappedResizeDeltas,
  getViewportFrame,
  getVisibleSnapTargets,
} from '../utils';
import { useCanvasNodeRegistration } from './useCanvasNodeRegistration';
import { useCanvasNodeSelection } from './useCanvasNodeSelection';
import { useMeasuredHeight } from './useMeasuredHeight';

interface DragState {
  startX: number;
  startY: number;
  originX: number;
  originY: number;
}

interface NodeInteraction {
  type: 'drag' | 'resize';
  cursor: string;
}

/** The cursor held for the duration of a resize from each edge. */
const RESIZE_CURSORS: Record<CanvasNodeResizeEdge, string> = {
  left: 'ew-resize',
  right: 'ew-resize',
  bottom: 'ns-resize',
  'top-left': 'nwse-resize',
  'top-right': 'nesw-resize',
  'bottom-left': 'nesw-resize',
  'bottom-right': 'nwse-resize',
};

export interface UseCanvasNodeOptions {
  /**
   * The node's unique ID within the canvas, used to register the
   * node's frame with the canvas instance.
   */
  id: string;

  /**
   * The node's controlled horizontal position in canvas coordinates.
   */
  x: number;

  /**
   * The node's controlled vertical position in canvas coordinates.
   */
  y: number;

  /**
   * The node's controlled width.
   */
  width: number;

  /**
   * The node's controlled height. Omit for auto-height nodes
   * whose height follows their content.
   */
  height?: number;

  /**
   * The minimum width the node can be resized to.
   */
  minWidth?: number;

  /**
   * The minimum height the node can be resized to.
   */
  minHeight?: number;

  /**
   * Clamps the node's position and size to its parent element's
   * bounds. For standalone usage outside a canvas, where nodes
   * live in a fixed workspace rather than an infinite canvas.
   */
  bounded?: boolean;

  /**
   * Whether pressing the node selects it on the canvas. Defaults
   * to true. Set to false for nodes whose consumer drives its own
   * selection model.
   */
  selectable?: boolean;

  /**
   * Called once when a drag or resize interaction ends and the
   * frame changed, with the rounded result frame.
   */
  onFrameChange?: (frame: CanvasNodeFrame) => void;

  /**
   * Called when a drag interaction starts or ends.
   */
  onDragStateChange?: (dragging: boolean) => void;
}

export interface UseCanvasNodeResult {
  /**
   * The node's live frame, reflecting in-progress interactions.
   * The height is the measured content height for auto-height
   * nodes.
   */
  frame: CanvasNodeFrame;

  /**
   * Ref to attach to the node element.
   */
  nodeRef: React.RefObject<HTMLDivElement | null>;

  /**
   * Props to spread onto the node element: the ref, positioning
   * style and node ID data attribute.
   */
  nodeProps: {
    ref: React.RefObject<HTMLDivElement | null>;
    style: React.CSSProperties;
    'data-canvas-node-id': string;
  };

  /**
   * Returns props to spread onto the element that starts node
   * drags.
   */
  getDragHandleProps: () => {
    onMouseDown: (event: React.MouseEvent) => void;
  };

  /**
   * Returns props to spread onto the element whose presses select
   * the node, usually the node itself.
   */
  getSelectionProps: () => {
    onMouseDown: (event: React.MouseEvent) => void;
  };

  /**
   * Returns props to spread onto a resize handle for the given
   * edge.
   */
  getResizeHandleProps: (edge: CanvasNodeResizeEdge) => {
    onMouseDown: (event: React.MouseEvent) => void;
  };

  /**
   * Whether the node is part of the canvas's current selection.
   * Always false for standalone nodes and unselectable nodes.
   */
  selected: boolean;

  /**
   * Whether the node is currently being dragged.
   */
  isDragging: boolean;

  /**
   * Whether the node is currently being resized.
   */
  isResizing: boolean;

  /**
   * Whether the pointer moved during the latest drag-handle
   * press. Used to distinguish clicks from drags.
   */
  wasDragged: () => boolean;
}

/**
 * Headless drag/resize/selection behaviour for a canvas node:
 * tracks the node's live frame during interactions (scaling mouse
 * deltas by the canvas zoom), registers the frame with the canvas
 * instance, reports the final frame when an interaction ends, and
 * applies presses to the canvas's selection.
 *
 * Works without a CanvasProvider for standalone bounded usage, in
 * which case the zoom is treated as 1.
 */
export function useCanvasNode(
  options: UseCanvasNodeOptions,
): UseCanvasNodeResult {
  const {
    id,
    x,
    y,
    width,
    height,
    minWidth = NODE_MIN_WIDTH,
    minHeight = NODE_MIN_HEIGHT,
    bounded = false,
    selectable = true,
    onFrameChange,
    onDragStateChange,
  } = options;

  const nodeRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<DragState | null>(null);
  const resizeState = useRef<CanvasNodeResizeState | null>(null);
  const didDrag = useRef(false);
  const [position, setPosition] = useState({ x, y });
  const [size, setSize] = useState({ width, height: height ?? 0 });
  // The in-progress interaction, driving the window mouse
  // listeners and the interaction lock
  const [interaction, setInteraction] = useState<NodeInteraction | null>(null);
  // Latest position/size for reading inside the mouseup handler
  const positionRef = useRef(position);
  const sizeRef = useRef(size);
  const context = useOptionalCanvasContext();
  const { selected, selectionOffset } = useCanvasNodeSelection(id, selectable);

  // Auto-height nodes follow their content height
  const autoHeight = height === undefined;

  const measuredHeight = useMeasuredHeight(nodeRef);

  // Hold the pointer for the interaction, so dragging over text
  // content neither selects it nor swaps the cursor
  useInteractionLock(interaction ? interaction.cursor : null);

  // The node's position, carrying the offset of a group drag it
  // is part of
  const offsetPosition = selectionOffset
    ? { x: position.x + selectionOffset.x, y: position.y + selectionOffset.y }
    : position;

  // The node's effective height: measured for auto-height nodes
  const effectiveHeight = autoHeight ? measuredHeight : size.height;

  // Keep the node's live frame registered with the canvas instance
  useCanvasNodeRegistration(id, {
    x: offsetPosition.x,
    y: offsetPosition.y,
    width: size.width,
    height: effectiveHeight,
  });

  // Mirror position/size into refs for the mouseup handler
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  // Sync position + size from the controlled props
  useLayoutEffect(() => {
    setPosition({ x, y });
    setSize({ width, height: height ?? 0 });
  }, [x, y, width, height]);

  /**
   * Clamps a position so the node stays within its parent
   * element. Unbounded nodes live in infinite canvas coordinates
   * and are never clamped.
   */
  const clampPosition = useCallback(
    (positionX: number, positionY: number) => {
      if (!bounded) {
        return { x: positionX, y: positionY };
      }

      const workspace = nodeRef.current?.parentElement;

      if (!workspace || !nodeRef.current) {
        return { x: positionX, y: positionY };
      }

      const nodeWidth = nodeRef.current.offsetWidth;
      const nodeHeight = nodeRef.current.offsetHeight;

      return {
        x: Math.max(0, Math.min(workspace.offsetWidth - nodeWidth, positionX)),
        y: Math.max(
          0,
          Math.min(workspace.offsetHeight - nodeHeight, positionY),
        ),
      };
    },
    [bounded],
  );

  // Start dragging when the drag handle is pressed
  const handleDragHandleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      // Only the left button starts a drag
      if (event.button !== 0) {
        return;
      }

      // Keep the browser from starting a text selection anchored
      // at the handle
      event.preventDefault();

      didDrag.current = false;

      dragState.current = {
        startX: event.clientX,
        startY: event.clientY,
        originX: positionRef.current.x,
        originY: positionRef.current.y,
      };

      setInteraction({ type: 'drag', cursor: 'grabbing' });

      if (onDragStateChange) {
        onDragStateChange(true);
      }
    },
    [onDragStateChange],
  );

  // Apply a press on the node to the canvas's selection: a
  // modifier press toggles the node, a plain press on a node
  // outside the selection replaces it. Presses on a node within a
  // multi-node selection leave the selection intact, so the group
  // stays together while it is dragged.
  const handleSelectMouseDown = useCallback(
    (event: React.MouseEvent) => {
      // Only the left button selects
      if (event.button !== 0 || !selectable || !context) {
        return;
      }

      // Presses on content that handles them itself, such as
      // inputs, buttons, menus and editors, never select the node
      if (isInteractiveTarget(event.target)) {
        return;
      }

      const { store } = context;

      // Shift and the platform's multi-select modifier both toggle
      if (event.shiftKey || event.metaKey || event.ctrlKey) {
        store.toggleNodeSelection(id);

        return;
      }

      // The node is already selected, leave the selection as it is
      if (store.isNodeSelected(id)) {
        return;
      }

      store.selectNodes([id]);
    },
    [context, id, selectable],
  );

  // Start a resize operation on mousedown
  const handleResizeMouseDown = useCallback(
    (event: React.MouseEvent, edge: CanvasNodeResizeEdge) => {
      event.stopPropagation();
      // Keep the browser from starting a text selection anchored
      // at the handle
      event.preventDefault();

      resizeState.current = {
        edge,
        startX: event.clientX,
        startY: event.clientY,
        originWidth: sizeRef.current.width,
        originHeight: sizeRef.current.height,
        originX: positionRef.current.x,
        originY: positionRef.current.y,
      };

      setInteraction({ type: 'resize', cursor: RESIZE_CURSORS[edge] });
    },
    [],
  );

  // Track mouse movement during drag or resize
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      // Nodes live in the zoomed canvas coordinate space, so
      // screen-pixel mouse deltas are scaled down by the zoom
      const scale = context ? context.store.getZoom() : 1;

      // Snapping is a canvas instance setting, so standalone
      // nodes never snap
      const snap = context ? context.store.getSnapToGrid() : false;
      const snapObjects = context ? context.store.getSnapToObjects() : false;

      // Handle node dragging
      if (dragState.current) {
        didDrag.current = true;

        // The position the pointer dragged the node to
        const dragged = {
          x:
            dragState.current.originX +
            (event.clientX - dragState.current.startX) / scale,
          y:
            dragState.current.originY +
            (event.clientY - dragState.current.startY) / scale,
        };

        const snapped = getSnappedNodePosition(
          dragged,
          context?.store.getNode(id) ?? null,
          {
            grid: snap,
            objects: snapObjects,
            targets: snapObjects ? getSnapTargets(context, id) : [],
            // The snapping distance is in screen pixels, so it is
            // unscaled into canvas units
            threshold: OBJECT_SNAP_DISTANCE / scale,
          },
        );

        // Show the guides for the alignments the node snapped to
        if (context) {
          context.store.setAlignmentGuides(snapped.guides);
        }

        setPosition(clampPosition(snapped.x, snapped.y));
      }

      // Handle node resizing
      if (resizeState.current) {
        const { startX, startY } = resizeState.current;

        // The distance the pointer dragged the moving edges
        const dragged = {
          x: (event.clientX - startX) / scale,
          y: (event.clientY - startY) / scale,
        };

        const snapped = getSnappedResizeDeltas(resizeState.current, dragged, {
          grid: snap,
          objects: snapObjects,
          targets: snapObjects ? getSnapTargets(context, id) : [],
          // The snapping distance is in screen pixels, so it is
          // unscaled into canvas units
          threshold: OBJECT_SNAP_DISTANCE / scale,
          // Shift key enables mirror resizing from center
          mirror: event.shiftKey,
        });

        // Show the guides for the alignments the edges snapped to
        if (context) {
          context.store.setAlignmentGuides(snapped.guides);
        }

        // Bounded nodes are clamped to their parent element;
        // canvas nodes resize freely in canvas coordinates
        const bounds = bounded
          ? {
              width: nodeRef.current?.parentElement?.offsetWidth ?? Infinity,
              height: nodeRef.current?.parentElement?.offsetHeight ?? Infinity,
            }
          : null;

        // The frame values the resize lands on, leaving out the
        // ones the dragged edge does not change
        const resized = getResizedNodeFrame(
          resizeState.current,
          snapped.x,
          snapped.y,
          {
            minWidth,
            minHeight,
            mirror: event.shiftKey,
            bounds,
          },
        );

        // Apply the resized dimensions
        if (resized.width !== undefined || resized.height !== undefined) {
          setSize((current) => ({
            width: resized.width ?? current.width,
            height: resized.height ?? current.height,
          }));
        }

        // Apply the shift of the edges the resize moves
        if (resized.x !== undefined || resized.y !== undefined) {
          setPosition((current) => ({
            x: resized.x ?? current.x,
            y: resized.y ?? current.y,
          }));
        }
      }
    },
    [context, id, bounded, minWidth, minHeight, clampPosition],
  );

  // End drag or resize on mouseup, reporting the frame when it
  // changed
  const handleMouseUp = useCallback(() => {
    const wasDragging = Boolean(dragState.current);

    dragState.current = null;
    resizeState.current = null;

    setInteraction(null);

    // The alignment guides only apply to an in-progress
    // interaction
    if (context) {
      context.store.setAlignmentGuides([]);
    }

    if (wasDragging && onDragStateChange) {
      onDragStateChange(false);
    }

    if (!onFrameChange) {
      return;
    }

    const frame: CanvasNodeFrame = {
      x: Math.round(positionRef.current.x),
      y: Math.round(positionRef.current.y),
      width: Math.round(sizeRef.current.width),
      height: Math.round(
        autoHeight
          ? nodeRef.current?.offsetHeight || 0
          : sizeRef.current.height,
      ),
    };

    // Only report frames that differ from the controlled props;
    // auto-height nodes ignore height changes
    const changed =
      frame.x !== Math.round(x) ||
      frame.y !== Math.round(y) ||
      frame.width !== Math.round(width) ||
      (!autoHeight && frame.height !== Math.round(height ?? 0));

    if (changed) {
      onFrameChange(frame);
    }
  }, [
    context,
    onFrameChange,
    onDragStateChange,
    autoHeight,
    x,
    y,
    width,
    height,
  ]);

  // Attach global mouse listeners while an interaction is active
  useEffect(() => {
    if (!interaction) {
      return;
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [interaction, handleMouseMove, handleMouseUp]);

  const getDragHandleProps = useCallback(
    () => ({ onMouseDown: handleDragHandleMouseDown }),
    [handleDragHandleMouseDown],
  );

  const getSelectionProps = useCallback(
    () => ({ onMouseDown: handleSelectMouseDown }),
    [handleSelectMouseDown],
  );

  const getResizeHandleProps = useCallback(
    (edge: CanvasNodeResizeEdge) => ({
      onMouseDown: (event: React.MouseEvent) =>
        handleResizeMouseDown(event, edge),
    }),
    [handleResizeMouseDown],
  );

  const wasDragged = useCallback(() => didDrag.current, []);

  return {
    frame: {
      x: offsetPosition.x,
      y: offsetPosition.y,
      width: size.width,
      height: effectiveHeight,
    },
    nodeRef,
    nodeProps: {
      ref: nodeRef,
      style: {
        transform: `translate(${offsetPosition.x}px, ${offsetPosition.y}px)`,
        width: size.width,
        ...(autoHeight ? {} : { height: size.height }),
      },
      'data-canvas-node-id': id,
    },
    getDragHandleProps,
    getSelectionProps,
    getResizeHandleProps,
    selected,
    isDragging: interaction?.type === 'drag',
    isResizing: interaction?.type === 'resize',
    wasDragged,
  };
}

/**
 * Returns the frames the node's interactions snap to, read from
 * the canvas instance. Standalone nodes have nothing to snap to,
 * since snapping is a canvas instance feature.
 */
function getSnapTargets(
  context: CanvasContextValue | null,
  id: string,
): CanvasNodeFrame[] {
  if (!context) {
    return [];
  }

  const { store } = context;

  return getVisibleSnapTargets(
    store.getNodes(),
    id,
    // The visible area in canvas coordinates
    getViewportFrame(store.getPan(), store.getZoom(), store.getViewportSize()),
  );
}
