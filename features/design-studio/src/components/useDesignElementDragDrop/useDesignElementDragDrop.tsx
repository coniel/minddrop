import React, { useCallback, useEffect, useRef } from 'react';
import {
  DropIndicator,
  useFlexDropContainer,
} from '@minddrop/feature-drag-and-drop';
import { useDraggable, useDroppable } from '@minddrop/selection';
import { DesignElementsDataKey } from '../../constants';
import { handleDropOnDesignElement } from '../../handleDropOnDesignElement';
import { FlatContainerDesignElement, FlatDesignElement } from '../../types';

export interface UseDesignElementDragDropOptions {
  index: number;
  element: FlatDesignElement;
  disabled?: boolean;
  isLastChild?: boolean;
  gap?: number;
}

export interface UseDesignElementDragDropResult {
  dragDropProps: Record<string, unknown>;
  dropIndicator: React.ReactNode;
  isDragging: boolean;
}

export function useDesignElementDragDrop({
  index,
  element,
  disabled = false,
  isLastChild = false,
  gap = 0,
}: UseDesignElementDragDropOptions): UseDesignElementDragDropResult {
  // Check if this is an empty container that should accept inside drops
  const isEmptyContainer =
    element.type === 'container' &&
    (element as FlatContainerDesignElement).children.length === 0;

  // Get the parent FlexDropContainer context for gap expansion
  const flexDropContainer = useFlexDropContainer();

  const { draggableProps, isDragging } = useDraggable({
    id: element.id,
    type: DesignElementsDataKey,
    data: element,
  });

  const { droppableProps, dropIndicatorPosition, isDraggingOver } =
    useDroppable({
      index,
      type: 'design-element',
      id: element.id,
      axis: 'vertical',
      enableInside: element.type === 'container',
      edgeThreshold: isEmptyContainer ? 0 : 0.25,
      isLastChild,
      onDrop: handleDropOnDesignElement,
    });

  // Track the previous position to avoid redundant context calls
  const previousPositionRef = useRef(dropIndicatorPosition);

  // Communicate before/after positions to the parent FlexDropContainer
  // so it can expand the appropriate gap
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
      flexDropContainer.collapseGap();

      return;
    }

    // Map element drop position to the adjacent gap index
    if (
      dropIndicatorPosition === 'before' ||
      dropIndicatorPosition === 'start'
    ) {
      // Expand the gap before this element
      flexDropContainer.expandGap(index);
    } else if (
      dropIndicatorPosition === 'after' ||
      dropIndicatorPosition === 'end'
    ) {
      // Expand the gap after this element
      flexDropContainer.expandGap(index + 1);
    } else {
      // "inside" position — collapse any expanded gap
      flexDropContainer.collapseGap();
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
      dropIndicator: null,
      isDragging: false,
    };
  }

  // Only show the DropIndicator for "inside" drops on empty containers.
  // Before/after positions are handled by gap expansion.
  const showDropIndicator =
    isDraggingOver && isEmptyContainer && dropIndicatorPosition === 'inside';

  return {
    isDragging,
    dragDropProps: {
      ...draggableProps,
      ...droppableProps,
      onDragStart,
    },
    dropIndicator: (
      <DropIndicator
        axis="horizontal"
        show={showDropIndicator}
        position={dropIndicatorPosition}
        gap={gap}
      />
    ),
  };
}
