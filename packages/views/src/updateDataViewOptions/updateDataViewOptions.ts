import { DataView } from '../types';
import { updateDataView } from '../updateDataView';

/**
 * Updates a data view's options. A convenience wrapper around `updateDataView`
 * that updates only the options field.
 *
 * @param id - The ID of the data view to update.
 * @param options - The options to update.
 * @param deepMerge - Whether to deep merge the options. Defaults to true.
 * @returns The updated data view.
 */
export async function updateDataViewOptions(
  id: string,
  options: object,
  deepMerge = true,
): Promise<DataView> {
  return updateDataView(id, { options }, deepMerge);
}
