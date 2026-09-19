import { useMemo } from 'react';
import { DatabaseId } from '@minddrop/databases';
import { DragAndDrop, DraggableUtils } from '@minddrop/drag-and-drop';
import { NewDatabaseEntriesDataKey } from './constants';

/**
 * Returns drag utilities for an element which creates a new entry in
 * the given database when dropped. Does not modify the selection, as
 * the dragged element does not represent an existing entry.
 *
 * @param databaseId - The ID of the database in which to create the entry.
 * @returns Drag utilities.
 */
export function useNewEntryDraggable(databaseId: DatabaseId): DraggableUtils {
  // The drag's data, naming the database to create the entry in
  const data = useMemo(
    () => ({ [NewDatabaseEntriesDataKey]: [databaseId] }),
    [databaseId],
  );

  // Drag the new entry card, as a copy since the card stays in place
  const { draggableProps, isDragging } = DragAndDrop.useDraggable({
    id: `new-entry:${databaseId}`,
    type: NewDatabaseEntriesDataKey,
    data,
    effect: 'copy',
  });

  return { isDragging, draggableProps };
}
