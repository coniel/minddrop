import { useCallback, useEffect, useRef, useState } from 'react';
import { ItemRect, calculateOverIndex, reorderArray } from './sortable-utils';

export type SortableDirection = 'vertical' | 'horizontal';

export interface SortableItemRenderProps {
  /**
   * Ref to attach to the item's root element.
   */
  ref: (element: HTMLElement | null) => void;

  /**
   * Props to spread on the drag handle (or the item root for full-item drag).
   */
  handleProps: {
    onPointerDown: (event: React.PointerEvent) => void;
  };

  /**
   * Whether this item is currently being dragged.
   */
  isDragging: boolean;

  /**
   * Inline style to apply (contains the transform).
   */
  style: React.CSSProperties;

  /**
   * CSS class name for transition/dragging state.
   */
  className: string;
}

interface DragState {
  /**
   * Index of the item being dragged.
   */
  activeIndex: number;

  /**
   * Current insertion index the dragged item would drop into.
   */
  overIndex: number;

  /**
   * Pointer position at drag start.
   */
  startPointer: number;

  /**
   * Snapshotted item rects at drag start.
   */
  itemRects: DOMRect[];

  /**
   * Snapshotted item rects along the drag axis at drag start.
   */
  itemAxisRects: ItemRect[];

  /**
   * Snapshotted container rect at drag start.
   */
  containerRect: DOMRect;

  /**
   * Gap between items in pixels (resolved from CSS at drag start).
   */
  gapPx: number;

  /**
   * The element that received pointer capture.
   */
  captureElement: HTMLElement;

  /**
   * The pointer ID used for capture.
   */
  pointerId: number;
}

interface UseSortableDragOptions {
  /**
   * Ordered item IDs.
   */
  items: string[];

  /**
   * Layout direction.
   */
  direction: SortableDirection;

  /**
   * Gap token (1-7), used to compute displacement.
   */
  gap: number;

  /**
   * Called on drop with the reordered item IDs.
   */
  onSort: (newOrder: string[]) => void;
}

/**
 * Core hook for sortable drag-and-drop. Returns a map of item IDs
 * to their render props (ref, handleProps, isDragging, style, className).
 *
 * Uses pointer events for axis-locked dragging, direct DOM transforms
 * for the dragged item (no React re-render per frame), and CSS
 * transitions for displaced items.
 */
export function useSortableDrag({
  items,
  direction,
  gap,
  onSort,
}: UseSortableDragOptions): Map<string, SortableItemRenderProps> {
  // Refs for each item's DOM element, keyed by index
  const itemElements = useRef<(HTMLElement | null)[]>([]);

  // Container element ref (derived from first item's parent)
  const containerRef = useRef<HTMLElement | null>(null);

  // Current drag state (null when not dragging)
  const dragStateRef = useRef<DragState | null>(null);

  // Current dragged delta (axis-only, clamped to container)
  const dragDeltaRef = useRef(0);

  // React state for overIndex (triggers re-render for displaced items)
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  // Keep items ref current for use in event handlers
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const onSortRef = useRef(onSort);
  onSortRef.current = onSort;

  const directionRef = useRef(direction);
  directionRef.current = direction;

  /**
   * Returns the axis-relevant coordinate from a pointer event.
   */
  const getPointerPosition = useCallback(
    (event: PointerEvent | React.PointerEvent) => {
      if (directionRef.current === 'vertical') {
        return event.clientY;
      }

      return event.clientX;
    },
    [],
  );

  /**
   * Returns the axis-relevant position and size from a DOMRect.
   */
  const getRectAxis = useCallback((rect: DOMRect) => {
    if (directionRef.current === 'vertical') {
      return { start: rect.top, size: rect.height };
    }

    return { start: rect.left, size: rect.width };
  }, []);

  /**
   * Handles pointer down on a drag handle. Snapshots all item rects,
   * sets pointer capture, and begins tracking the drag.
   */
  const handlePointerDown = useCallback(
    (index: number, event: React.PointerEvent) => {
      // Only respond to primary button
      if (event.button !== 0) {
        return;
      }

      const element = itemElements.current[index];

      if (!element) {
        return;
      }

      // Derive container from the item's parent
      const container = element.parentElement;

      if (!container) {
        return;
      }

      containerRef.current = container;

      // Snapshot all item rects
      const rects = itemElements.current.map(
        (itemElement) => itemElement?.getBoundingClientRect() ?? new DOMRect(),
      );

      // Compute axis-projected rects for overlap calculations
      const axisRects = rects.map((rect) => getRectAxis(rect));

      // Resolve the actual gap in pixels from the container's computed style
      const computedStyle = window.getComputedStyle(container);
      const gapValue =
        directionRef.current === 'vertical'
          ? computedStyle.rowGap
          : computedStyle.columnGap;
      const gapPx = parseFloat(gapValue) || 0;

      // Set pointer capture on the handle element for reliable tracking
      const captureElement = event.currentTarget as HTMLElement;
      captureElement.setPointerCapture(event.pointerId);

      // Prevent text selection during drag
      event.preventDefault();

      // Store drag state
      dragStateRef.current = {
        activeIndex: index,
        overIndex: index,
        startPointer: getPointerPosition(event),
        itemRects: rects,
        itemAxisRects: axisRects,
        containerRect: container.getBoundingClientRect(),
        gapPx,
        captureElement,
        pointerId: event.pointerId,
      };

      dragDeltaRef.current = 0;

      // Trigger React state to show dragging/shifting classes
      setActiveIndex(index);
      setOverIndex(index);
    },
    [getPointerPosition, getRectAxis],
  );

  /**
   * Handles pointer move during a drag. Updates the dragged item's
   * transform directly on the DOM (no re-render), and only triggers
   * a React state update when the overIndex changes.
   */
  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const state = dragStateRef.current;

      if (!state) {
        return;
      }

      // Compute raw delta along the drag axis
      const currentPointer = getPointerPosition(event);
      let delta = currentPointer - state.startPointer;

      // Clamp delta so the dragged item stays within the container
      const draggedDomRect = state.itemRects[state.activeIndex];
      const { start: draggedStart, size: draggedSize } =
        getRectAxis(draggedDomRect);
      const { start: containerStart, size: containerSize } = getRectAxis(
        state.containerRect,
      );

      // Minimum delta: can't move before container start
      const minDelta = containerStart - draggedStart;

      // Maximum delta: can't move past container end
      const maxDelta =
        containerStart + containerSize - draggedStart - draggedSize;

      delta = Math.max(minDelta, Math.min(maxDelta, delta));

      // Store the clamped delta
      dragDeltaRef.current = delta;

      // Apply transform directly to the DOM element (no React re-render)
      const element = itemElements.current[state.activeIndex];

      if (element) {
        const transform =
          directionRef.current === 'vertical'
            ? `translateY(${delta}px)`
            : `translateX(${delta}px)`;

        element.style.transform = transform;
      }

      // Calculate the dragged item's current rect along the drag axis
      const origRect = state.itemAxisRects[state.activeIndex];
      const draggedRect: ItemRect = {
        start: origRect.start + delta,
        size: origRect.size,
      };

      // Determine the new over index based on 50% overlap
      const newOverIndex = calculateOverIndex(
        draggedRect,
        state.itemAxisRects,
        state.activeIndex,
      );

      // Only trigger React re-render when overIndex actually changes
      if (newOverIndex !== state.overIndex) {
        state.overIndex = newOverIndex;
        setOverIndex(newOverIndex);
      }
    },
    [getPointerPosition, getRectAxis],
  );

  /**
   * Handles pointer up — finalizes the drag, calls onSort if
   * order changed, and resets all state.
   */
  const handlePointerUp = useCallback(() => {
    const state = dragStateRef.current;

    if (!state) {
      return;
    }

    // Release pointer capture
    try {
      state.captureElement.releasePointerCapture(state.pointerId);
    } catch {
      // Pointer capture may already be released
    }

    // Clear the dragged item's inline transform
    const element = itemElements.current[state.activeIndex];

    if (element) {
      element.style.transform = '';
    }

    // If order changed, notify the consumer
    if (state.activeIndex !== state.overIndex) {
      const newOrder = reorderArray(
        itemsRef.current,
        state.activeIndex,
        state.overIndex,
      );
      onSortRef.current(newOrder);
    }

    // Reset all drag state
    dragStateRef.current = null;
    dragDeltaRef.current = 0;
    setActiveIndex(null);
    setOverIndex(null);
  }, []);

  /**
   * Handles Escape key — cancels the drag without reordering.
   */
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key !== 'Escape') {
      return;
    }

    const state = dragStateRef.current;

    if (!state) {
      return;
    }

    // Release pointer capture
    try {
      state.captureElement.releasePointerCapture(state.pointerId);
    } catch {
      // Pointer capture may already be released
    }

    // Clear the dragged item's inline transform
    const element = itemElements.current[state.activeIndex];

    if (element) {
      element.style.transform = '';
    }

    // Reset without calling onSort
    dragStateRef.current = null;
    dragDeltaRef.current = 0;
    setActiveIndex(null);
    setOverIndex(null);
  }, []);

  // Attach global pointer move/up and keydown listeners
  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlePointerMove, handlePointerUp, handleKeyDown]);

  // Build render props map for each item
  const renderPropsMap = new Map<string, SortableItemRenderProps>();

  items.forEach((id, index) => {
    const isDragging = activeIndex === index;

    // Compute displacement transform for non-dragged items
    let style: React.CSSProperties = {};
    let className = '';

    if (activeIndex !== null && overIndex !== null && !isDragging) {
      const state = dragStateRef.current;

      if (state) {
        // Determine displacement direction and amount
        const { size: draggedSize } = getRectAxis(
          state.itemRects[state.activeIndex],
        );
        const displacement = draggedSize + state.gapPx;

        let shift = 0;

        if (state.activeIndex < overIndex) {
          // Dragged item moved forward — items between active and over shift backward
          if (index > state.activeIndex && index <= overIndex) {
            shift = -displacement;
          }
        } else if (state.activeIndex > overIndex) {
          // Dragged item moved backward — items between over and active shift forward
          if (index >= overIndex && index < state.activeIndex) {
            shift = displacement;
          }
        }

        const transformValue =
          directionRef.current === 'vertical'
            ? `translateY(${shift}px)`
            : `translateX(${shift}px)`;

        style = { transform: transformValue };
        className = 'sortable-list-item-shifting';
      }
    }

    if (isDragging) {
      className = 'sortable-list-item-dragging';
    }

    renderPropsMap.set(id, {
      ref: (element: HTMLElement | null) => {
        itemElements.current[index] = element;
      },
      handleProps: {
        onPointerDown: (event: React.PointerEvent) => {
          handlePointerDown(index, event);
        },
      },
      isDragging,
      style,
      className,
    });
  });

  return renderPropsMap;
}
