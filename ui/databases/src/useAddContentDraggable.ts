import React, { useCallback, useState } from 'react';
import { Selection } from '@minddrop/selection';
import { setDragPreview } from '@minddrop/utils';
import { AddContentDataKey } from './constants';

export interface AddContentDragUtils {
  /**
   * Whether the element is currently being dragged.
   */
  isDragging: boolean;

  /**
   * Combined drag event handlers to spread onto the element.
   */
  draggableProps: {
    draggable: boolean;
    onDragStart: (event: React.DragEvent) => void;
    onDragEnd: (event: React.DragEvent) => void;
  };
}

/**
 * Returns drag utilities for an element which spawns the add
 * content picker when dropped. Does not modify the selection, as
 * the dragged element does not represent an existing entry.
 *
 * @returns Drag utilities.
 */
export function useAddContentDraggable(): AddContentDragUtils {
  const [isDragging, setIsDragging] = useState(false);

  const onDragStart = useCallback((event: React.DragEvent) => {
    // Prevent parent elements from becoming the dragged element
    event.stopPropagation();

    if (!event.dataTransfer) {
      return;
    }

    // Mark the drag as an add content card
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData(
      Selection.toMimeType(AddContentDataKey),
      JSON.stringify(true),
    );

    // Set the drag preview explicitly, since the browser
    // generated preview fails inside transformed ancestors.
    setDragPreview(event, event.currentTarget);

    setIsDragging(true);
  }, []);

  const onDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    isDragging,
    draggableProps: {
      draggable: true,
      onDragStart,
      onDragEnd,
    },
  };
}
