import { useCallback, useMemo } from 'react';
import { DropEventData, Selection } from '@minddrop/selection';
import { useFlexDropGapActivation } from '@minddrop/ui-drag-and-drop';
import { composeRefs } from '@minddrop/utils';
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

  // Build the element's selection item
  const selectionItem = useMemo(
    () => ({ id: element.id, type: DesignElementsDataKey, data: element }),
    [element],
  );

  // Register the element as draggable
  const { draggableProps, isDragging } = Selection.useDraggable(selectionItem);

  // Route drops on this element into its frame's layout,
  // regardless of which layout is active
  const handleDrop = useCallback(
    (drop: DropEventData) => {
      handleDropOnDesignElement(studio, drop, layoutId ?? undefined);
    },
    [studio, layoutId],
  );

  const { droppableProps, dropIndicatorPosition, isDraggingOver } =
    Selection.useDroppable({
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
  // element's before/after drag position.
  useFlexDropGapActivation({ index, isDraggingOver, dropIndicatorPosition });

  // Compose the drag and drop refs, since both attach to the one element
  const ref = useMemo(
    () => composeRefs(draggableProps.ref, droppableProps.ref),
    [draggableProps.ref, droppableProps.ref],
  );

  // Return no props when drag and drop is disabled
  if (disabled) {
    return {
      dragDropProps: {},
      isDragging: false,
    };
  }

  // Non-draggable elements (e.g. page panel regions) keep their
  // drop target so content can still be dropped inside them.
  if (!draggable) {
    return {
      dragDropProps: { ...droppableProps },
      isDragging: false,
    };
  }

  // Return the drag and drop props on the composed ref
  return {
    isDragging,
    dragDropProps: {
      ...draggableProps,
      ...droppableProps,
      ref,
    },
  };
}
