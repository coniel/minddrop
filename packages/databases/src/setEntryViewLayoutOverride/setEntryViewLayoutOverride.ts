import { Designs, LayoutNotFoundError } from '@minddrop/designs';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntry } from '../getDatabaseEntry';
import { updateEntryMetadata } from '../updateEntryMetadata';

/**
 * Sets a per-view layout override on an entry's metadata. When set,
 * the entry will use the specified layout in the given view instead
 * of the database or view default.
 *
 * @param entryId - The ID of the entry.
 * @param viewId - The ID of the view.
 * @param layoutId - The ID of the layout to use.
 *
 * @throws {LayoutNotFoundError} If the layout is not part of the database's design.
 */
export function setEntryViewLayoutOverride(
  entryId: string,
  viewId: string,
  layoutId: string,
): void {
  // Get the entry to read its current metadata
  const entry = getDatabaseEntry(entryId);

  // Get the entry's database to access its design
  const database = getDatabase(entry.database);

  // Look up the database's design
  const design = database.designId
    ? Designs.get(database.designId, false)
    : null;

  // Ensure the layout belongs to the database's design
  if (!design?.layouts.some((layout) => layout.id === layoutId)) {
    throw new LayoutNotFoundError(layoutId);
  }

  // Update the entry metadata with the new layout override
  updateEntryMetadata(entryId, {
    ...entry.metadata,
    viewLayoutOverrides: {
      ...entry.metadata.viewLayoutOverrides,
      [viewId]: layoutId,
    },
  });
}
