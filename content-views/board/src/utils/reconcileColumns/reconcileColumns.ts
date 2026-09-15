import { BoardColumns } from '../../types';
import { placeEntryBelow } from '../placeEntryBelow';

/**
 * Reconciles saved column data with the current list of entries.
 * - Entries present in the collection but missing from columns
 *   are appended to the first column, except duplicates whose
 *   in-flight placement hint puts them below their original.
 * - Entries in columns that are no longer in the collection
 *   are removed.
 *
 * @param columns - The saved columns.
 * @param entries - The IDs of the collection's current entries.
 * @param duplicateOriginals - Unplaced duplicate entry IDs mapped to their original's ID.
 * @returns The reconciled columns.
 */
export function reconcileColumns(
  columns: BoardColumns,
  entries: string[],
  duplicateOriginals: Record<string, string> = {},
): BoardColumns {
  const entrySet = new Set(entries);
  const placedEntries = new Set<string>();

  // Filter out entries that no longer exist in the collection
  let filtered = columns.map((column) =>
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

  // Entries in the collection which the columns do not place
  const unplaced = entries.filter((entryId) => !placedEntries.has(entryId));

  unplaced.forEach((entryId) => {
    // Place a duplicate below its original while its placement is
    // in flight.
    const originalId = duplicateOriginals[entryId];

    if (originalId) {
      const placed = placeEntryBelow(filtered, originalId, entryId);

      // Check that the original was on the board to place below
      if (placed !== filtered) {
        filtered = placed;

        return;
      }
    }

    // Append other unplaced entries to the first column
    filtered[0] = [...filtered[0], entryId];
  });

  return filtered;
}
