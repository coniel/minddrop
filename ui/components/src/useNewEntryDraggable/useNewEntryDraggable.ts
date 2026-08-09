import React, { useCallback, useState } from 'react';
import { DatabaseId } from '@minddrop/databases';
import { toMimeType } from '@minddrop/selection';
import { setDragPreview } from '@minddrop/utils';
import { NewDatabaseEntriesDataKey } from '../constants';

export interface NewEntryDragUtils {
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
 * Returns drag utilities for an element which creates a new entry in
 * the given database when dropped. Does not modify the selection, as
 * the dragged element does not represent an existing entry.
 *
 * @param databaseId - The ID of the database in which to create the entry.
 * @returns Drag utilities.
 */
export function useNewEntryDraggable(
  databaseId: DatabaseId,
): NewEntryDragUtils {
  const [isDragging, setIsDragging] = useState(false);

  const onDragStart = useCallback(
    (event: React.DragEvent) => {
      // Prevent parent elements from becoming the dragged element
      event.stopPropagation();

      if (!event.dataTransfer) {
        return;
      }

      // Serialize the database into the drag event data
      event.dataTransfer.effectAllowed = 'copy';
      event.dataTransfer.setData(
        toMimeType(NewDatabaseEntriesDataKey),
        JSON.stringify([databaseId]),
      );

      // Set the drag preview explicitly, since the browser
      // generated preview fails inside transformed ancestors
      setDragPreview(event, event.currentTarget);

      setIsDragging(true);
    },
    [databaseId],
  );

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
