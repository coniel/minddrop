import { getDatabase } from '../getDatabase';
import { Database } from '../types';
import { updateDatabase } from '../updateDatabase';

/**
 * Removes a per-view layout override from a database. The view
 * will revert to using the database's default layout.
 *
 * @param databaseId - The ID of the database.
 * @param viewId - The ID of the view.
 * @returns The updated database.
 */
export function clearDatabaseViewLayout(
  databaseId: string,
  viewId: string,
): Promise<Database> {
  // Get the database
  const database = getDatabase(databaseId);

  // Remove the target view layout override
  const { [viewId]: _, ...remainingViewLayouts } = database.viewLayouts || {};

  // Update the database
  return updateDatabase(databaseId, {
    viewLayouts: remainingViewLayouts,
  });
}
