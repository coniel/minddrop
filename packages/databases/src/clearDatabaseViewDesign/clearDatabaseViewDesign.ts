import { getDatabase } from '../getDatabase';
import { Database } from '../types';
import { updateDatabase } from '../updateDatabase';

/**
 * Removes a per-view design override from a database. The view
 * will revert to using the database's default design.
 *
 * @param databaseId - The ID of the database.
 * @param viewId - The ID of the view.
 * @returns The updated database.
 */
export function clearDatabaseViewDesign(
  databaseId: string,
  viewId: string,
): Promise<Database> {
  // Get the database
  const database = getDatabase(databaseId);

  // Remove the target view design override
  const { [viewId]: _, ...remainingViewDesigns } = database.viewDesigns || {};

  // Update the database
  return updateDatabase(databaseId, {
    viewDesigns: remainingViewDesigns,
  });
}
