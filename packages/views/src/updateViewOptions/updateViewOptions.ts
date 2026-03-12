import { View } from '../types';
import { updateView } from '../updateView';

/**
 * Updates a view's options. A convenience wrapper around `updateView`
 * that updates only the options field.
 *
 * @param id - The ID of the view to update.
 * @param options - The options to update.
 * @param deepMerge - Whether to deep merge the options. Defaults to true.
 * @returns The updated view.
 */
export async function updateViewOptions(
  id: string,
  options: object,
  deepMerge = true,
): Promise<View> {
  return updateView(id, { options }, deepMerge);
}
