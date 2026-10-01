import { BoardColumns } from '../../types';
import { placeEntriesInColumn } from '../placeEntriesInColumn';
import { placeEntryInNewColumn } from '../placeEntryInNewColumn';

/**
 * Places entries, in order, into a new column inserted at a gap
 * between columns, removing each from its current column if it is
 * already on the board. Inserts no column when there are no entries.
 *
 * @param columns - The current columns.
 * @param entryIds - The IDs of the entries to place, in order.
 * @param gapIndex - The index of the gap at which to insert the new column.
 * @returns The updated columns.
 */
export function placeEntriesInNewColumn(
  columns: BoardColumns,
  entryIds: string[],
  gapIndex: number,
): BoardColumns {
  const [firstEntryId, ...remainingEntryIds] = entryIds;

  // Insert no column for no entries
  if (!firstEntryId) {
    return columns;
  }

  // Place the first entry in the new column, and the rest below it
  return placeEntriesInColumn(
    placeEntryInNewColumn(columns, firstEntryId, gapIndex),
    remainingEntryIds,
    gapIndex,
    1,
  );
}
