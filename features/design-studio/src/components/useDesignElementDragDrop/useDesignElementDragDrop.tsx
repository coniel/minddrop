import React, { useCallback } from 'react';
import { DropIndicator } from '@minddrop/feature-drag-and-drop';
import { useDraggable, useDroppable } from '@minddrop/selection';
import { DesignElementsDataKey } from '../../constants';
import { handleDropOnDesignElement } from '../../handleDropOnDesignElement';
import { FlatDesignElement } from '../../types';

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
      enableInside: false,
      edgeThreshold: 0.5,
      isLastChild,
      onDrop: handleDropOnDesignElement,
    });

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
        show={isDraggingOver}
        position={dropIndicatorPosition}
        gap={gap}
      />
    ),
  };
}
