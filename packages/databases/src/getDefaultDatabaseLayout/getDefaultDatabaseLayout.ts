import { Designs, Layout, LayoutType } from '@minddrop/designs';
import { getDatabase } from '../getDatabase';

/**
 * Returns the default layout of the specified type for a database.
 * Resolves in order: explicit pin in `defaultLayouts` (if still present in
 * the database's design) → first layout of the type in the database's
 * design → null. Returns null when the database has no `designId` set;
 * the renderer handles the missing case with an inline fallback.
 *
 * @param databaseId - The ID of the database.
 * @param type - The layout type.
 * @returns The resolved layout, or null if the database has no design or
 *   no matching layout exists in it.
 */
export function getDefaultDatabaseLayout(
  databaseId: string,
  type: LayoutType,
): Layout | null {
  // Get the database
  const database = getDatabase(databaseId);

  // No design assigned; the renderer falls back inline
  if (!database.designId) {
    return null;
  }

  // Look up the database's design; bail if it no longer exists
  const design = Designs.get(database.designId, false);

  if (!design) {
    return null;
  }

  // If a default is pinned, return it when present in the design and the type matches
  const pinnedId = database.defaultLayouts[type];

  if (pinnedId) {
    const pinned = design.layouts.find((layout) => layout.id === pinnedId);

    if (pinned && pinned.type === type) {
      return pinned;
    }
  }

  // Fall back to the first layout of the requested type in the design
  return design.layouts.find((layout) => layout.type === type) || null;
}
