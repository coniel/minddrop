import { ContentView } from '../types';
import { updateContentView } from '../updateContentView';

/**
 * Updates a content view's options. A convenience wrapper around `updateContentView`
 * that updates only the options field.
 *
 * @param id - The ID of the content view to update.
 * @param options - The options to update.
 * @param deepMerge - Whether to deep merge the options. Defaults to true.
 * @returns The updated content view.
 */
export async function updateContentViewOptions(
  id: string,
  options: object,
  deepMerge = true,
): Promise<ContentView> {
  return updateContentView(id, { options }, deepMerge);
}
