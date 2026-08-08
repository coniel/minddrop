import React, { useCallback } from 'react';
import { DropEventData, useDraggable, useDroppable } from '@minddrop/selection';
import { useFlexDropGapActivation } from '@minddrop/ui-drag-and-drop';
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
  // Check if this is an empty container that should accept inside drops
  const isEmptyContainer =
    element.type === 'container' &&
    (element as FlatContainerDesignElement).children.length === 0;

  const layoutId = useLayoutId();

  const { draggableProps, isDragging } = useDraggable({
    id: element.id,
    type: DesignElementsDataKey,
    data: element,
  });

  // Route drops on this element into its frame's layout,
  // regardless of which layout is active
  const handleDrop = useCallback(
    (drop: DropEventData) => {
      handleDropOnDesignElement(drop, layoutId ?? undefined);
    },
    [layoutId],
  );

  const { droppableProps, dropIndicatorPosition, isDraggingOver } =
    useDroppable({
      index,
      type: 'design-element',
      id: element.id,
      axis: 'vertical',
      enableInside: element.type === 'container',
      edgeThreshold: isEmptyContainer ? 0 : 0.25,
      isLastChild,
      onDrop: handleDrop,
    });

  // Activate the parent FlexDropContainer gap adjacent to the
  // element's before/after drag position
  useFlexDropGapActivation({ index, isDraggingOver, dropIndicatorPosition });

  // Wrap onDragStart to manually set the drag image.
  // Elements inside the design canvas (which uses CSS transform)
  // don't get a browser-generated drag ghost.
  const onDragStart = useCallback(
    (event: React.DragEvent) => {
      draggableProps.onDragStart(event);

      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();

      const clone = target.cloneNode(true) as HTMLElement;

      clone.style.width = `${rect.width}px`;
      clone.style.position = 'fixed';
      clone.style.top = '-9999px';
      clone.style.left = '-9999px';
      document.body.appendChild(clone);

      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      event.dataTransfer.setDragImage(clone, offsetX, offsetY);

      requestAnimationFrame(() => {
        document.body.removeChild(clone);
      });
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
