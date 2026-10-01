import { BoardColumns } from '../../types';
import { placeEntryInColumn } from '../placeEntryInColumn';

/**
 * Places entries in consecutive positions of a column, starting at
 * the given position, removing each from its current column if it
 * is already on the board.
 *
 * @param columns - The current columns.
 * @param entryIds - The IDs of the entries to place, in order.
 * @param columnIndex - The index of the column to place the entries in.
 * @param entryIndex - The position within the column of the first entry.
 * @returns The updated columns.
 */
export function placeEntriesInColumn(
  columns: BoardColumns,
  entryIds: string[],
  columnIndex: number,
  entryIndex: number,
): BoardColumns {
  // Place each entry one position below the previous
  return entryIds.reduce(
    (updated, entryId, index) =>
      placeEntryInColumn(updated, entryId, columnIndex, entryIndex + index),
    columns,
  );
}
