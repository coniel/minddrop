import { View } from '../types';
import { updateView } from '../updateView';

/**
 * Sets the design override for a specific entry within a view.
 * A convenience wrapper around `updateView`.
 *
 * @param viewId - The ID of the view.
 * @param entryId - The ID of the entry.
 * @param designId - The ID of the design to use.
 * @returns The updated view.
 *
 * @throws {ViewNotFoundError} If the view does not exist.
 *
 * @dispatches views:view:updated
 */
export async function setEntryDesign(
  viewId: string,
  entryId: string,
  designId: string,
): Promise<View> {
  return updateView(viewId, {
    entryDesignMap: { [entryId]: designId },
  });
}
