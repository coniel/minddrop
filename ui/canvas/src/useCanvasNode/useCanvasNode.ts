import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useOptionalCanvasContext } from '../CanvasContext';
import { NODE_MIN_HEIGHT, NODE_MIN_WIDTH } from '../constants';
import { CanvasNodeFrame } from '../types';

/**
 * The edges and corners from which a node can be resized.
 */
export type CanvasNodeResizeEdge =
  | 'left'
  | 'right'
  | 'bottom'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

interface ResizeState {
  edge: CanvasNodeResizeEdge;
  startX: number;
  startY: number;
  originWidth: number;
  originHeight: number;
  originX: number;
  originY: number;
}

interface DragState {
  startX: number;
  startY: number;
  originX: number;
  originY: number;
}

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
   * Returns props to spread onto a resize handle for the given
   * edge.
   */
  getResizeHandleProps: (edge: CanvasNodeResizeEdge) => {
    onMouseDown: (event: React.MouseEvent) => void;
  };

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
 * Headless drag/resize behaviour for a canvas node: tracks the
 * node's live frame during interactions (scaling mouse deltas by
 * the canvas zoom), registers the frame with the canvas instance,
 * and reports the final frame when an interaction ends.
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
    onFrameChange,
    onDragStateChange,
  } = options;

  const nodeRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<DragState | null>(null);
  const resizeState = useRef<ResizeState | null>(null);
  const didDrag = useRef(false);
  const [position, setPosition] = useState({ x, y });
  const [size, setSize] = useState({ width, height: height ?? 0 });
  const [measuredHeight, setMeasuredHeight] = useState(0);
  // The in-progress interaction, driving the window mouse listeners
  const [interaction, setInteraction] = useState<'drag' | 'resize' | null>(
    null,
  );
  // Latest position/size for reading inside the mouseup handler
  const positionRef = useRef(position);
  const sizeRef = useRef(size);
  const context = useOptionalCanvasContext();

  // Auto-height nodes follow their content height
  const autoHeight = height === undefined;

  // The node's effective height: measured for auto-height nodes
  const effectiveHeight = autoHeight ? measuredHeight : size.height;

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

  // Measure the node's content height for auto-height nodes
  useEffect(() => {
    const node = nodeRef.current;

    if (!node) {
      return;
    }

    const measure = () => {
      setMeasuredHeight(node.offsetHeight);
    };

    // Initial measure before the first observer callback
    measure();

    const observer = new ResizeObserver(measure);

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Keep the node's live frame registered with the canvas instance
  useEffect(() => {
    if (!context) {
      return;
    }

    context.store.registerNode(id, {
      x: position.x,
      y: position.y,
      width: size.width,
      height: effectiveHeight,
    });
  }, [context, id, position.x, position.y, size.width, effectiveHeight]);

  // Unregister the node when it unmounts
  useEffect(() => {
    if (!context) {
      return;
    }

    return () => {
      context.store.unregisterNode(id);
    };
  }, [context, id]);

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

      setInteraction('drag');

      if (onDragStateChange) {
        onDragStateChange(true);
      }
    },
    [onDragStateChange],
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

      setInteraction('resize');
    },
    [],
  );

  // Track mouse movement during drag or resize
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      // Nodes live in the zoomed canvas coordinate space, so
      // screen-pixel mouse deltas are scaled down by the zoom
      const scale = context ? context.store.getZoom() : 1;

      // Handle node dragging
      if (dragState.current) {
        didDrag.current = true;
        const rawX =
          dragState.current.originX +
          (event.clientX - dragState.current.startX) / scale;
        const rawY =
          dragState.current.originY +
          (event.clientY - dragState.current.startY) / scale;

        setPosition(clampPosition(rawX, rawY));
      }

      // Handle node resizing
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
        const deltaX = (event.clientX - startX) / scale;
        const deltaY = (event.clientY - startY) / scale;

        // Workspace-bounds clamps only apply to bounded nodes;
        // canvas nodes resize freely in canvas coordinates
        const workspaceWidth = !bounded
          ? Infinity
          : (nodeRef.current?.parentElement?.offsetWidth ?? Infinity);
        const workspaceHeight = !bounded
          ? Infinity
          : (nodeRef.current?.parentElement?.offsetHeight ?? Infinity);
        const minPosition = !bounded ? -Infinity : 0;

        // Anchored edges: the opposite edge from the one being
        // dragged stays fixed.
        const rightEdge = originX + originWidth;
        const bottomEdge = originY + originHeight;

        // Shift key enables mirror resizing from center
        const mirror = event.shiftKey;
        const centerX = originX + originWidth / 2;
        const centerY = originY + originHeight / 2;

        // Mirror-resize width/height caps that keep the node's
        // leading edge inside the workspace in bounded mode
        const maxMirrorWidth = !bounded ? Infinity : centerX * 2;
        const maxMirrorHeight = !bounded ? Infinity : centerY * 2;

        switch (edge) {
          case 'right': {
            const newWidth = Math.min(
              Math.max(minWidth, originWidth + deltaX * (mirror ? 2 : 1)),
              mirror ? maxMirrorWidth : workspaceWidth - originX,
            );

            if (mirror) {
              const newX = centerX - newWidth / 2;

              setSize((current) => ({ ...current, width: newWidth }));
              setPosition((current) => ({ ...current, x: newX }));
            } else {
              setSize((current) => ({ ...current, width: newWidth }));
            }

            break;
          }

          case 'left': {
            if (mirror) {
              const newWidth = Math.min(
                Math.max(minWidth, originWidth - deltaX * 2),
                (workspaceWidth - centerX) * 2,
              );
              const newX = centerX - newWidth / 2;

              setSize((current) => ({ ...current, width: newWidth }));
              setPosition((current) => ({ ...current, x: newX }));
            } else {
              const newX = Math.max(
                minPosition,
                Math.min(rightEdge - minWidth, originX + deltaX),
              );

              setSize((current) => ({
                ...current,
                width: rightEdge - newX,
              }));
              setPosition((current) => ({ ...current, x: newX }));
            }

            break;
          }

          case 'bottom': {
            const newHeight = Math.min(
              Math.max(minHeight, originHeight + deltaY * (mirror ? 2 : 1)),
              mirror ? maxMirrorHeight : workspaceHeight - originY,
            );

            if (mirror) {
              const newY = centerY - newHeight / 2;

              setSize((current) => ({ ...current, height: newHeight }));
              setPosition((current) => ({ ...current, y: newY }));
            } else {
              setSize((current) => ({ ...current, height: newHeight }));
            }

            break;
          }

          case 'top-left': {
            if (mirror) {
              const newWidth = Math.min(
                Math.max(minWidth, originWidth - deltaX * 2),
                (workspaceWidth - centerX) * 2,
              );
              const newHeight = Math.min(
                Math.max(minHeight, originHeight - deltaY * 2),
                (workspaceHeight - centerY) * 2,
              );

              setSize({ width: newWidth, height: newHeight });
              setPosition({
                x: centerX - newWidth / 2,
                y: centerY - newHeight / 2,
              });
            } else {
              const newX = Math.max(
                minPosition,
                Math.min(rightEdge - minWidth, originX + deltaX),
              );
              const newY = Math.max(
                minPosition,
                Math.min(bottomEdge - minHeight, originY + deltaY),
              );

              setSize({
                width: rightEdge - newX,
                height: bottomEdge - newY,
              });
              setPosition({ x: newX, y: newY });
            }

            break;
          }

          case 'top-right': {
            if (mirror) {
              const newWidth = Math.min(
                Math.max(minWidth, originWidth + deltaX * 2),
                maxMirrorWidth,
              );
              const newHeight = Math.min(
                Math.max(minHeight, originHeight - deltaY * 2),
                (workspaceHeight - centerY) * 2,
              );

              setSize({ width: newWidth, height: newHeight });
              setPosition({
                x: centerX - newWidth / 2,
                y: centerY - newHeight / 2,
              });
            } else {
              const newWidth = Math.min(
                Math.max(minWidth, originWidth + deltaX),
                workspaceWidth - originX,
              );
              const newY = Math.max(
                minPosition,
                Math.min(bottomEdge - minHeight, originY + deltaY),
              );

              setSize({ width: newWidth, height: bottomEdge - newY });
              setPosition((current) => ({ ...current, y: newY }));
            }

            break;
          }

          case 'bottom-left': {
            if (mirror) {
              const newWidth = Math.min(
                Math.max(minWidth, originWidth - deltaX * 2),
                (workspaceWidth - centerX) * 2,
              );
              const newHeight = Math.min(
                Math.max(minHeight, originHeight + deltaY * 2),
                maxMirrorHeight,
              );

              setSize({ width: newWidth, height: newHeight });
              setPosition({
                x: centerX - newWidth / 2,
                y: centerY - newHeight / 2,
              });
            } else {
              const newX = Math.max(
                minPosition,
                Math.min(rightEdge - minWidth, originX + deltaX),
              );
              const newHeight = Math.min(
                Math.max(minHeight, originHeight + deltaY),
                workspaceHeight - originY,
              );

              setSize({ width: rightEdge - newX, height: newHeight });
              setPosition((current) => ({ ...current, x: newX }));
            }

            break;
          }

          case 'bottom-right': {
            if (mirror) {
              const newWidth = Math.min(
                Math.max(minWidth, originWidth + deltaX * 2),
                maxMirrorWidth,
              );
              const newHeight = Math.min(
                Math.max(minHeight, originHeight + deltaY * 2),
                maxMirrorHeight,
              );

              setSize({ width: newWidth, height: newHeight });
              setPosition({
                x: centerX - newWidth / 2,
                y: centerY - newHeight / 2,
              });
            } else {
              const newWidth = Math.min(
                Math.max(minWidth, originWidth + deltaX),
                workspaceWidth - originX,
              );
              const newHeight = Math.min(
                Math.max(minHeight, originHeight + deltaY),
                workspaceHeight - originY,
              );

              setSize({ width: newWidth, height: newHeight });
            }

            break;
          }
        }
      }
    },
    [context, bounded, minWidth, minHeight, clampPosition],
  );

  // End drag or resize on mouseup, reporting the frame when it
  // changed
  const handleMouseUp = useCallback(() => {
    const wasDragging = Boolean(dragState.current);

    dragState.current = null;
    resizeState.current = null;

    setInteraction(null);

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
  }, [onFrameChange, onDragStateChange, autoHeight, x, y, width, height]);

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

  // Lock text selection globally while an interaction is active,
  // so moving the pointer across text content (e.g. editors
  // inside nodes) does not paint a selection
  useEffect(() => {
    if (!interaction) {
      return;
    }

    const previousUserSelect = document.body.style.userSelect;

    document.body.style.userSelect = 'none';

    return () => {
      document.body.style.userSelect = previousUserSelect;
    };
  }, [interaction]);

  const getDragHandleProps = useCallback(
    () => ({ onMouseDown: handleDragHandleMouseDown }),
    [handleDragHandleMouseDown],
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
      x: position.x,
      y: position.y,
      width: size.width,
      height: effectiveHeight,
    },
    nodeRef,
    nodeProps: {
      ref: nodeRef,
      style: {
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: size.width,
        ...(autoHeight ? {} : { height: size.height }),
      },
      'data-canvas-node-id': id,
    },
    getDragHandleProps,
    getResizeHandleProps,
    isDragging: interaction === 'drag',
    isResizing: interaction === 'resize',
    wasDragged,
  };
}
