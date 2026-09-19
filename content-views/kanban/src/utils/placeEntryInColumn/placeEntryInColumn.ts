import { KanbanColumn, KanbanOrder } from '../../types';

/**
 * Places an entry at a position within a column, removing it from
 * wherever it was placed before. The position indexes the column
 * as rendered, so entries the saved order does not place take the
 * positions they are shown at.
 *
 * @param columns - The board's columns, with their entries as rendered.
 * @param entryId - The ID of the entry to place.
 * @param columnValue - The option value keying the target column.
 * @param entryIndex - The position within the column at which to place the entry.
 * @returns The order to save.
 */
export function placeEntryInColumn(
  columns: KanbanColumn[],
  entryId: string,
  columnValue: string,
  entryIndex: number,
): KanbanOrder {
  // The entry's current position in the target column, -1 if it
  // is not in it.
  const currentIndex =
    columns
      .find((column) => column.value === columnValue)
      ?.entryIds.indexOf(entryId) ?? -1;

  // Work out where the entry lands once it has been removed.
  // Removing it from above the target position shifts the
  // positions below up by one.
  const targetIndex =
    currentIndex !== -1 && currentIndex < entryIndex
      ? entryIndex - 1
      : entryIndex;

  // Remove the entry from every column it is placed in
  const updated: KanbanOrder = {};

  columns.forEach((column) => {
    updated[column.value] = column.entryIds.filter((id) => id !== entryId);
  });

  // The target column, empty when nothing is placed in it yet
  const column = [...(updated[columnValue] ?? [])];

  // Insert the entry at the target position, clamped to the
  // column's length.
  column.splice(Math.min(targetIndex, column.length), 0, entryId);

  // Write the entry's column back into the order
  updated[columnValue] = column;

  return updated;
}
