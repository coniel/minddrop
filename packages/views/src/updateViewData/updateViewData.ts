import { View } from '../types';
import { updateView } from '../updateView';

/**
 * Updates a view's data. A convenience wrapper around `updateView`
 * that updates only the data field.
 *
 * @param id - The ID of the view to update.
 * @param data - The data to update.
 * @param deepMerge - Whether to deep merge the data. Defaults to true.
 * @returns The updated view.
 */
export async function updateViewData(
  id: string,
  data: object,
  deepMerge = true,
): Promise<View> {
  return updateView(id, { data }, deepMerge);
}
