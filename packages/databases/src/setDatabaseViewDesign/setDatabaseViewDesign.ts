import { getDatabase } from '../getDatabase';
import { Database } from '../types';
import { updateDatabase } from '../updateDatabase';

/**
 * Sets a per-view design override on a database. When set, the
 * view will use the specified design instead of the database default.
 *
 * @param databaseId - The ID of the database.
 * @param viewId - The ID of the view.
 * @param designId - The ID of the design to use.
 * @returns The updated database.
 */
export async function setDatabaseViewDesign(
  databaseId: string,
  viewId: string,
  designId: string,
): Promise<Database> {
  // Get the database
  const database = getDatabase(databaseId);

  // Set the view design override on the database
  return updateDatabase(databaseId, {
    viewDesigns: {
      ...database.viewDesigns,
      [viewId]: designId,
    },
  });
}
