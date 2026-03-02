import { View } from '../types';
import { updateView } from '../updateView';

/**
 * Sets the design to use for entries from a specific database
 * within a view. A convenience wrapper around `updateView`.
 *
 * @param viewId - The ID of the view.
 * @param databaseId - The ID of the database.
 * @param designId - The ID of the design to use.
 * @returns The updated view.
 *
 * @throws {ViewNotFoundError} If the view does not exist.
 *
 * @dispatches views:view:updated
 */
export async function setDatabaseDesign(
  viewId: string,
  databaseId: string,
  designId: string,
): Promise<View> {
  return updateView(viewId, {
    databaseDesignMap: { [databaseId]: designId },
  });
}
