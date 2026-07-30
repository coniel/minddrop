import { Designs, LayoutNotFoundError } from '@minddrop/designs';
import { getDatabase } from '../getDatabase';
import { Database } from '../types';
import { updateDatabase } from '../updateDatabase';

/**
 * Sets a per-view layout override on a database. When set, the
 * view will use the specified layout instead of the database default.
 *
 * @param databaseId - The ID of the database.
 * @param viewId - The ID of the view.
 * @param layoutId - The ID of the layout to use.
 * @returns The updated database.
 *
 * @throws {DatabaseNotFoundError} If the database does not exist.
 * @throws {LayoutNotFoundError} If the layout is not part of the database's design.
 */
export async function setDatabaseViewLayout(
  databaseId: string,
  viewId: string,
  layoutId: string,
): Promise<Database> {
  // Get the database
  const database = getDatabase(databaseId);

  // Look up the database's design
  const design = database.designId
    ? Designs.get(database.designId, false)
    : null;

  // Ensure the layout belongs to the database's design
  if (!design?.layouts.some((layout) => layout.id === layoutId)) {
    throw new LayoutNotFoundError(layoutId);
  }

  // Set the view layout override on the database
  return updateDatabase(databaseId, {
    viewLayouts: {
      ...database.viewLayouts,
      [viewId]: layoutId,
    },
  });
}
