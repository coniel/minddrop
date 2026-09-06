import { restoreDates } from '@minddrop/utils';
import { resolveDataViewConfig } from '../resolveDataViewConfig';
import { StoredDataView } from '../types';

/**
 * Deserializes a stored data view: restores its date fields and
 * resolves the config's durable references into item IDs.
 *
 * @param storedView - The stored data view to deserialize.
 * @returns The deserialized data view.
 */
export function deserializeDataView(
  storedView: StoredDataView,
): StoredDataView {
  // Restore the view's date fields (dates are stored as ISO strings)
  const view = restoreDates<StoredDataView>(storedView);

  // Resolve the stored config's durable references into item IDs
  return {
    ...view,
    ...resolveDataViewConfig(view.type, {
      options: view.options,
      data: view.data,
    }),
  };
}
