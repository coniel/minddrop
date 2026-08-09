import { BoardColumns } from '../../types';
import { removeEntryFromColumns } from '../removeEntryFromColumns';

/**
 * Places an entry at a specific position within a column, removing
 * it from its current column if it is already on the board.
 *
 * @param columns - The current columns.
 * @param entryId - The ID of the entry to place.
 * @param columnIndex - The index of the column to place the entry in.
 * @param entryIndex - The position within the column at which to place the entry.
 * @returns The updated columns.
 */
export function placeEntryInColumn(
  columns: BoardColumns,
  entryId: string,
  columnIndex: number,
  entryIndex: number,
): BoardColumns {
  // The entry's current position in the target column, -1 if
  // it is not in it
  const currentIndex = columns[columnIndex]
    ? columns[columnIndex].indexOf(entryId)
    : -1;

  // Removing the entry from above the target position shifts the
  // positions below it up by one
  const targetIndex =
    currentIndex !== -1 && currentIndex < entryIndex
      ? entryIndex - 1
      : entryIndex;

  const updated = removeEntryFromColumns(columns, entryId);

  // Ignore placements into a column which does not exist
  if (!updated[columnIndex]) {
    return columns;
  }

  updated[columnIndex].splice(targetIndex, 0, entryId);

  return updated;
}
