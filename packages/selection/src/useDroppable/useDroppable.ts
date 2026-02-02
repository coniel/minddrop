import { useCallback, useRef, useState } from 'react';
import { DropEventData, DropPosition } from '../types';
import { getEventData } from '../utils';

type Axis = 'horizontal' | 'vertical' | 'container';
type DropIndicatorPosition = 'before' | 'after' | 'inside' | null;

interface UseDroppableOptions {
  type: string;
  id?: string;
  index?: number;
  onDrop?: (data: DropEventData) => void;
  axis?: Axis;
  threshold?: number;
  enableInside?: boolean;
  edgeThreshold?: number;
}

interface UseDroppableReturn {
  ref: React.RefObject<HTMLElement> | null;
  dragHandlers: {
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    onDragEnter: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
  };
  dropIndicator: DropIndicatorPosition;
  isDraggingOver: boolean;
}

export function useDroppable(options: UseDroppableOptions): UseDroppableReturn {
  const {
    type,
    id,
    index,
    onDrop,
    axis = 'container',
    threshold = 0.5,
    enableInside = false,
    edgeThreshold = 0.25,
  } = options;

  const ref = useRef<HTMLElement>(null);
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
        position = relativePosition < threshold ? 'before' : 'after';
      }

      return position;
    },
    [axis, threshold, enableInside, edgeThreshold],
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
    dragHandlers: {
      onDragOver: handleDragOver,
      onDrop: handleDrop,
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
    },
    dropIndicator: dragState.dropIndicator,
    isDraggingOver: dragState.isDraggingOver,
  };
}
