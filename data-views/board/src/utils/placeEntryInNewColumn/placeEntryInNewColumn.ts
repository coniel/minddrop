import { BoardColumns } from '../../types';
import { removeEntryFromColumns } from '../removeEntryFromColumns';

/**
 * Places an entry into a new column inserted at a gap between
 * columns, removing it from its current column if it is already
 * on the board.
 *
 * @param columns - The current columns.
 * @param entryId - The ID of the entry to place.
 * @param gapIndex - The index of the gap at which to insert the new column.
 * @returns The updated columns.
 */
export function placeEntryInNewColumn(
  columns: BoardColumns,
  entryId: string,
  gapIndex: number,
): BoardColumns {
  const updated = removeEntryFromColumns(columns, entryId);

  updated.splice(gapIndex, 0, [entryId]);

  return updated;
}
