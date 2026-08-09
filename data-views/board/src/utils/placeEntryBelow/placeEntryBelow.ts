import { BoardColumns } from '../../types';
import { placeEntryInColumn } from '../placeEntryInColumn';

/**
 * Places an entry directly below a target entry, in the same column.
 *
 * @param columns - The current columns.
 * @param targetEntryId - The ID of the entry below which to place the entry.
 * @param entryId - The ID of the entry to place.
 * @returns The updated columns, unchanged if the target entry is not on the board.
 */
export function placeEntryBelow(
  columns: BoardColumns,
  targetEntryId: string,
  entryId: string,
): BoardColumns {
  // Locate the column containing the target entry
  const columnIndex = columns.findIndex((column) =>
    column.includes(targetEntryId),
  );

  // Leave the entry unplaced if the target is not on the board
  if (columnIndex === -1) {
    return columns;
  }

  // The position directly below the target entry
  const entryIndex = columns[columnIndex].indexOf(targetEntryId) + 1;

  return placeEntryInColumn(columns, entryId, columnIndex, entryIndex);
}
