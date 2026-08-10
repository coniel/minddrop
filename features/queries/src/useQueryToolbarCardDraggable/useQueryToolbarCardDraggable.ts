import React, { useCallback, useState } from 'react';
import { QueryNodeType } from '@minddrop/queries';
import { toMimeType } from '@minddrop/selection';
import { setDragPreview } from '@minddrop/utils';
import { QueryNodeCardDataKey, QuerySourceCardDataKey } from '../constants';

export interface QueryToolbarCardDragUtils {
  /**
   * Whether the card is currently being dragged.
   */
  isDragging: boolean;

  /**
   * Combined drag event handlers to spread onto the card.
   */
  draggableProps: {
    draggable: boolean;
    onDragStart: (event: React.DragEvent) => void;
    onDragEnd: (event: React.DragEvent) => void;
  };
}

/**
 * Returns drag utilities for a query builder toolbar card which
 * creates a node of the given type when dropped onto the
 * canvas. Source cards spawn a database picker instead.
 *
 * @param type - The type of node the card creates.
 *
 * @returns Drag utilities.
 */
export function useQueryToolbarCardDraggable(
  type: Exclude<QueryNodeType, 'results'>,
): QueryToolbarCardDragUtils {
  const [isDragging, setIsDragging] = useState(false);

  const onDragStart = useCallback(
    (event: React.DragEvent) => {
      // Prevent parent elements from becoming the dragged element
      event.stopPropagation();

      if (!event.dataTransfer) {
        return;
      }

      event.dataTransfer.effectAllowed = 'copy';

      // Source cards spawn a database picker on drop
      if (type === 'source') {
        event.dataTransfer.setData(
          toMimeType(QuerySourceCardDataKey),
          JSON.stringify(true),
        );
      } else {
        // Serialize the node type into the drag event data
        event.dataTransfer.setData(
          toMimeType(QueryNodeCardDataKey),
          JSON.stringify(type),
        );
      }

      // Set the drag preview explicitly, since the browser
      // generated preview fails inside transformed ancestors
      setDragPreview(event, event.currentTarget);

      setIsDragging(true);
    },
    [type],
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
