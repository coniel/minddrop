import { getDatabaseEntry } from '../getDatabaseEntry';
import { updateEntryMetadata } from '../updateEntryMetadata';

/**
 * Sets a per-view design override on an entry's metadata. When set,
 * the entry will use the specified design in the given view instead
 * of the database or view default.
 *
 * @param entryId - The ID of the entry.
 * @param viewId - The ID of the view.
 * @param designId - The ID of the design to use.
 */
export function setEntryViewDesignOverride(
  entryId: string,
  viewId: string,
  designId: string,
): void {
  // Get the entry to read its current metadata
  const entry = getDatabaseEntry(entryId);

  // Update the entry metadata with the new design override
  updateEntryMetadata(entryId, {
    ...entry.metadata,
    designOverrides: {
      ...entry.metadata.designOverrides,
      [viewId]: designId,
    },
  });
}
