import { useMemo } from 'react';
import { DragAndDrop, DraggableUtils } from '@minddrop/drag-and-drop';
import { QueryNodeType } from '@minddrop/queries';
import { QueryNodeCardDataKey } from './constants';

/**
 * Returns drag utilities for a query builder toolbar card.
 *
 * @param type - The type of node the card creates.
 * @returns The card's drag utilities.
 */
export function useQueryToolbarCardDraggable(
  type: Exclude<QueryNodeType, 'source' | 'results'>,
): DraggableUtils {
  // Build the drag data, carrying the type of node the card
  // creates.
  const data = useMemo(() => ({ [QueryNodeCardDataKey]: type }), [type]);

  // Register the card as draggable
  const { draggableProps, isDragging } = DragAndDrop.useDraggable({
    id: `query-toolbar-card:${type}`,
    type: QueryNodeCardDataKey,
    data,
  });

  return { isDragging, draggableProps };
}
