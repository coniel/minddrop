import { BoardColumns } from '../../types';

/**
 * Removes an entry from the column it is currently in.
 *
 * @param columns - The current columns.
 * @param entryId - The ID of the entry to remove.
 * @returns The updated columns.
 */
export function removeEntryFromColumns(
  columns: BoardColumns,
  entryId: string,
): BoardColumns {
  return columns.map((column) => column.filter((id) => id !== entryId));
}
