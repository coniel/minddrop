import { BoardColumns } from '../../types';

/**
 * Reconciles saved column data with the current list of entries.
 * - Entries present in the collection but missing from columns
 *   are appended to the first column.
 * - Entries in columns that are no longer in the collection
 *   are removed.
 */
export function reconcileColumns(
  columns: BoardColumns,
  entries: string[],
): BoardColumns {
  const entrySet = new Set(entries);
  const placedEntries = new Set<string>();

  // Filter out entries that no longer exist in the collection
  const filtered = columns.map((column) =>
    column.filter((entryId) => {
      if (entrySet.has(entryId)) {
        placedEntries.add(entryId);

        return true;
      }

      return false;
    }),
  );

  // Ensure we have at least one column
  if (filtered.length === 0) {
    filtered.push([]);
  }

  // Append unplaced entries to the first column
  const unplaced = entries.filter((entryId) => !placedEntries.has(entryId));

  if (unplaced.length > 0) {
    filtered[0] = [...filtered[0], ...unplaced];
  }

  return filtered;
}
