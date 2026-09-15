import { ContentView } from '../types';
import { updateContentView } from '../updateContentView';

/**
 * Updates a content view's data. A convenience wrapper around `updateContentView`
 * that updates only the data field.
 *
 * @param id - The ID of the content view to update.
 * @param data - The data to update.
 * @param deepMerge - Whether to deep merge the data. Defaults to true.
 * @returns The updated content view.
 */
export async function updateContentViewData(
  id: string,
  data: object,
  deepMerge = true,
): Promise<ContentView> {
  return updateContentView(id, { data }, deepMerge);
}
