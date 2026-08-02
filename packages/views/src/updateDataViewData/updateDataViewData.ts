import { DataView } from '../types';
import { updateDataView } from '../updateDataView';

/**
 * Updates a data view's data. A convenience wrapper around `updateDataView`
 * that updates only the data field.
 *
 * @param id - The ID of the data view to update.
 * @param data - The data to update.
 * @param deepMerge - Whether to deep merge the data. Defaults to true.
 * @returns The updated data view.
 */
export async function updateDataViewData(
  id: string,
  data: object,
  deepMerge = true,
): Promise<DataView> {
  return updateDataView(id, { data }, deepMerge);
}
