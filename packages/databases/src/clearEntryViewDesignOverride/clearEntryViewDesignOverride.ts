import { getDatabaseEntry } from '../getDatabaseEntry';
import { updateEntryMetadata } from '../updateEntryMetadata';

/**
 * Removes a per-view design override from an entry's metadata. The
 * entry will revert to using the database or view default design.
 *
 * @param entryId - The ID of the entry.
 * @param viewId - The ID of the view.
 */
export function clearEntryViewDesignOverride(
  entryId: string,
  viewId: string,
): void {
  // Get the entry to read its current metadata
  const entry = getDatabaseEntry(entryId);

  // Remove the target view design override
  const { [viewId]: _, ...remainingOverrides } =
    entry.metadata.designOverrides || {};

  // Update the entry metadata without the removed override
  updateEntryMetadata(entryId, {
    ...entry.metadata,
    designOverrides: remainingOverrides,
  });
}
