import React, { useCallback, useEffect, useRef } from 'react';
import { DropEventData, useDraggable, useDroppable } from '@minddrop/selection';
import { useFlexDropContainer } from '@minddrop/ui-drag-and-drop';
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

  // Get the parent FlexDropContainer context for gap activation
  const flexDropContainer = useFlexDropContainer();
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

  // Track the previous position to avoid redundant context calls
  const previousPositionRef = useRef(dropIndicatorPosition);

  // Communicate before/after positions to the parent FlexDropContainer
  // so it can activate the appropriate gap
  useEffect(() => {
    if (!flexDropContainer) {
      return;
    }

    // Skip if position hasn't changed
    if (previousPositionRef.current === dropIndicatorPosition) {
      return;
    }

    previousPositionRef.current = dropIndicatorPosition;

    if (!isDraggingOver || !dropIndicatorPosition) {
      flexDropContainer.deactivateGap();

      return;
    }

    // Map element drop position to the adjacent gap index
    if (
      dropIndicatorPosition === 'before' ||
      dropIndicatorPosition === 'start'
    ) {
      // Activate the gap before this element
      flexDropContainer.activateGap(index);
    } else if (
      dropIndicatorPosition === 'after' ||
      dropIndicatorPosition === 'end'
    ) {
      // Activate the gap after this element
      flexDropContainer.activateGap(index + 1);
    } else {
      // "inside" position - deactivate any active gap
      flexDropContainer.deactivateGap();
    }
  }, [flexDropContainer, isDraggingOver, dropIndicatorPosition, index]);

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
