import { useCallback } from 'react';
import { DropEventData, useDraggable, useDroppable } from '@minddrop/selection';
import { useFlexDropGapActivation } from '@minddrop/ui-drag-and-drop';
import { setDragPreview } from '@minddrop/utils';
import { useDesignStudio } from './DesignStudioStore';
import { useLayoutId } from './LayoutIdContext';
import { DesignElementsDataKey } from './constants';
import { handleDropOnDesignElement } from './handleDropOnDesignElement';
import { FlatContainerDesignElement, FlatDesignElement } from './types';

export interface UseDesignElementDragDropOptions {
  index: number;
  element: FlatDesignElement;
  disabled?: boolean;
  draggable?: boolean;
  isLastChild?: boolean;
}

export interface UseDesignElementDragDropResult {
  dragDropProps: Record<string, unknown>;
  isDragging: boolean;
}

export function useDesignElementDragDrop({
  index,
  element,
  disabled = false,
  draggable = true,
  isLastChild = false,
}: UseDesignElementDragDropOptions): UseDesignElementDragDropResult {
  const studio = useDesignStudio();
  const layoutId = useLayoutId();

  // Container-like element types accept drops inside themselves
  const isContainer = element.type === 'container';

  // Check if this is an empty container that should accept inside drops
  const isEmptyContainer =
    isContainer &&
    (element as FlatContainerDesignElement).children.length === 0;

  const { draggableProps, isDragging } = useDraggable({
    id: element.id,
    type: DesignElementsDataKey,
    data: element,
  });

  // Route drops on this element into its frame's layout,
  // regardless of which layout is active
  const handleDrop = useCallback(
    (drop: DropEventData) => {
      handleDropOnDesignElement(studio, drop, layoutId ?? undefined);
    },
    [studio, layoutId],
  );

  const { droppableProps, dropIndicatorPosition, isDraggingOver } =
    useDroppable({
      index,
      type: 'design-element',
      id: element.id,
      axis: 'vertical',
      enableInside: isContainer,
      edgeThreshold: isEmptyContainer ? 0 : 0.25,
      isLastChild,
      onDrop: handleDrop,
    });

  // Activate the parent FlexDropContainer gap adjacent to the
  // element's before/after drag position
  useFlexDropGapActivation({ index, isDraggingOver, dropIndicatorPosition });

  // Wrap onDragStart to manually set the drag preview.
  // Elements inside the design canvas (which uses CSS transform)
  // don't get a browser-generated drag ghost.
  const onDragStart = useCallback(
    (event: React.DragEvent) => {
      draggableProps.onDragStart(event);

      setDragPreview(event, event.currentTarget);
    },
    [draggableProps],
  );

  if (disabled) {
    return {
      dragDropProps: {},
      isDragging: false,
    };
  }

  // Non-draggable elements (e.g. page panel regions) keep their
  // drop target so content can still be dropped inside them
  if (!draggable) {
    return {
      dragDropProps: { ...droppableProps },
      isDragging: false,
    };
  }

  return {
    isDragging,
    dragDropProps: {
      ...draggableProps,
      ...droppableProps,
      onDragStart,
    },
  };
}
