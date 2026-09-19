import { useMemo } from 'react';
import { DragAndDrop, DraggableUtils } from '@minddrop/drag-and-drop';
import { QueryNodeType } from '@minddrop/queries';
import { QueryNodeCardDataKey, QuerySourceCardDataKey } from './constants';

/**
 * Returns drag utilities for a query builder toolbar card.
 *
 * @param type - The type of node the card creates.
 * @returns The card's drag utilities.
 */
export function useQueryToolbarCardDraggable(
  type: Exclude<QueryNodeType, 'results'>,
): DraggableUtils {
  // Resolve the card's data key
  const dataKey =
    type === 'source' ? QuerySourceCardDataKey : QueryNodeCardDataKey;
  // Build the drag data. Source cards send a source flag, other cards
  // the type of node they create.
  const data = useMemo(
    () => ({ [dataKey]: type === 'source' ? true : type }),
    [dataKey, type],
  );

  // Register the card as draggable
  const { draggableProps, isDragging } = DragAndDrop.useDraggable({
    id: `query-toolbar-card:${type}`,
    type: dataKey,
    data,
  });

  return { isDragging, draggableProps };
}
