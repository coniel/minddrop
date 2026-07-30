import { getDatabaseEntry } from '../getDatabaseEntry';
import { updateEntryMetadata } from '../updateEntryMetadata';

/**
 * Removes a per-view layout override from an entry's metadata. The
 * entry will revert to using the database's default layout.
 *
 * @param entryId - The ID of the entry.
 * @param viewId - The ID of the view.
 */
export function clearEntryViewLayoutOverride(
  entryId: string,
  viewId: string,
): void {
  // Get the entry to read its current metadata
  const entry = getDatabaseEntry(entryId);

  // Remove the target view layout override
  const { [viewId]: _, ...remainingOverrides } =
    entry.metadata.viewLayoutOverrides || {};

  // Update the entry metadata without the removed override
  updateEntryMetadata(entryId, {
    ...entry.metadata,
    viewLayoutOverrides: remainingOverrides,
  });
}
