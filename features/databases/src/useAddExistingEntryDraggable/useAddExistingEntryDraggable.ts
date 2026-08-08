import React, { useCallback, useState } from 'react';
import { toMimeType } from '@minddrop/selection';
import { setDragPreview } from '@minddrop/utils';
import { AddExistingEntryDataKey } from '../constants';

export interface AddExistingEntryDragUtils {
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
 * Returns drag utilities for an element which spawns an existing
 * entry picker when dropped. Does not modify the selection, as the
 * dragged element does not represent an existing entry.
 *
 * @returns Drag utilities.
 */
export function useAddExistingEntryDraggable(): AddExistingEntryDragUtils {
  const [isDragging, setIsDragging] = useState(false);

  const onDragStart = useCallback((event: React.DragEvent) => {
    // Prevent parent elements from becoming the dragged element
    event.stopPropagation();

    if (!event.dataTransfer) {
      return;
    }

    // Mark the drag as an add existing entry card
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData(
      toMimeType(AddExistingEntryDataKey),
      JSON.stringify(true),
    );

    // Set the drag preview explicitly, since the browser
    // generated preview fails inside transformed ancestors
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
