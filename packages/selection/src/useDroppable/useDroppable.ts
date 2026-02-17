import { useCallback, useRef, useState } from 'react';
import { DropEventData, DropPosition } from '../types';
import { getEventData } from '../utils';

type Axis = 'horizontal' | 'vertical' | 'container';
type DropIndicatorPosition = 'before' | 'after' | 'inside' | null;

interface UseDroppableOptions {
  /**
   * The type of the element which should accept drops.
   */
  type: string;

  /**
   * The ID of the element which should accept drops.
   */
  id: string;

  /**
   * The index of the element which should accept drops, if the target
   * is an item of a list.
   */
  index?: number;

  /**
   * Callback fired when the user drops an element over the droppable
   * element.
   */
  onDrop?: (data: DropEventData) => void;

  /**
   * The axis on which to calculate before/after drop positions.
   * Can be one of:
   * - 'horizontal': elements can be dropped above/below the element
   * - 'vertical': elements can be dropped to the left/right of the element
   * - 'container': elements can only be dropped inside the element
   *
   * @default 'container'
   */
  axis?: Axis;

  /**
   * Whether to accept drops inside the element. If false, dropping inside
   * the element will always result in a drop before/after the element based
   * on an edge threshold of 0.5.
   *
   * Only applicable if `axis` is other than 'container'.
   *
   * @default false
   */
  enableInside?: boolean;

  /**
   * How far from the edge of the element should be considered as before/after
   * the element. E.g. if the value is 0.25, the drop will be considered to be
   * before/after the element if the drop is within 25% of the element's edge.
   *
   * Only applicable if `enableInside` is true.
   *
   * @default 0.25
   */
  edgeThreshold?: number;
}

interface UseDroppableReturn {
  /**
   * Ref to apply to the element which should accept drops.
   */
  ref: React.RefObject<HTMLDivElement>;

  /**
   * Callback fired when the user starts dragging an element over the
   * droppable element.
   */
  onDragOver: (e: React.DragEvent) => void;

  /**
   * Callback fired when the user drops an element over the droppable
   * element.
   */
  onDrop: (e: React.DragEvent) => void;

  /**
   * Callback fired when the user starts dragging an element over the
   * droppable element.
   */
  onDragEnter: (e: React.DragEvent) => void;

  /**
   * Callback fired when the user stops dragging an element over the
   * droppable element.
   */
  onDragLeave: (e: React.DragEvent) => void;

  /**
   * The position of the drop indicator, relative to the droppable element.
   */
  dropIndicator: DropIndicatorPosition;

  /**
   * Whether the droppable element is currently being dragged over.
   */
  isDraggingOver: boolean;

  /**
   * Combined props for the drop functionality.
   * Useful for speading the props onto a component.
   */
  droppableProps: {
    ref: React.RefObject<HTMLDivElement>;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onDragEnter: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
  };
}

export function useDroppable(options: UseDroppableOptions): UseDroppableReturn {
  const {
    type,
    id,
    index,
    onDrop,
    axis = 'container',
    enableInside = false,
    edgeThreshold = 0.25,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<{
    isDraggingOver: boolean;
    dropIndicator: DropIndicatorPosition;
  }>({
    isDraggingOver: false,
    dropIndicator: null,
  });

  const getDropPosition = useCallback(
    (e: React.DragEvent): DropPosition => {
      if (!ref.current) return 'inside';

      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let relativePosition: number;

      if (axis === 'horizontal') {
        relativePosition = x / rect.width;
      } else if (axis === 'vertical') {
        relativePosition = y / rect.height;
      } else {
        // axis === 'container', 'inside' is the only valid value
        return 'inside';
      }

      let position: 'before' | 'after' | 'inside';

      if (enableInside) {
        if (relativePosition < edgeThreshold) {
          position = 'before';
        } else if (relativePosition > 1 - edgeThreshold) {
          position = 'after';
        } else {
          position = 'inside';
        }
      } else {
        position = relativePosition < 0.5 ? 'before' : 'after';
      }

      return position;
    },
    [axis, enableInside, edgeThreshold],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();

      const dropPosition = getDropPosition(e);

      if (dropPosition) {
        setDragState((prev) => {
          // Only update if the position actually changed
          if (prev.dropIndicator !== dropPosition || !prev.isDraggingOver) {
            return {
              isDraggingOver: true,
              dropIndicator: dropPosition,
            };
          }

          return prev;
        });
      }
    },
    [getDropPosition],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();

      const dropPosition = getDropPosition(e);

      setDragState({
        isDraggingOver: false,
        dropIndicator: null,
      });

      if (onDrop && dropPosition) {
        onDrop({
          event: e,
          data: getEventData(e),
          position: dropPosition,
          targetType: type,
          targetId: id,
          index,
        });
      }
    },
    [getDropPosition, onDrop],
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    // Don't set state here - let dragOver handle it to avoid extra renders
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();

    // Only clear if we're actually leaving the element (not entering a child)
    if (
      e.currentTarget === e.target ||
      !e.currentTarget.contains(e.relatedTarget as Node)
    ) {
      setDragState({
        isDraggingOver: false,
        dropIndicator: null,
      });
    }
  }, []);

  return {
    ref,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    droppableProps: {
      ref,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
    },
    dropIndicator: dragState.dropIndicator,
    isDraggingOver: dragState.isDraggingOver,
  };
}
