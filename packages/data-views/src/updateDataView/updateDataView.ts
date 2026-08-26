import { Events } from '@minddrop/events';
import {
  InvalidParameterError,
  deepMerge as deepMergeFn,
} from '@minddrop/utils';
import { DataViewsStore } from '../DataViewsStore';
import { DataViewUpdatedEvent } from '../events';
import { extractDataViewReferences } from '../extractDataViewReferences';
import { getDataView } from '../getDataView';
import {
  DataView,
  UpdateDataViewData,
  UpdateVirtualDataViewData,
} from '../types';
import { writeDataView } from '../writeDataView';

/**
 * Updates a data view, performing a deep merge by default.
 *
 * @param id - The ID of the data view to update.
 * @param data - The data to update the data view with.
 * @param deepMerge - Whether to deep merge the update data with the existing data view data.
 * @returns The updated data view.
 *
 * @throws {DataViewNotFoundError} If the data view with the specified ID does not exist.
 * @throws {InvalidParameterError} If attempting to change the ID of a non-virtual data view.
 *
 * @dispatches data-views:data-view:updated
 */
export async function updateDataView(
  id: string,
  data: UpdateDataViewData | UpdateVirtualDataViewData,
  deepMerge = true,
): Promise<DataView> {
  // Get the data view
  const view = getDataView(id);

  // Update the data view
  const update = { ...data, lastModified: new Date() };
  const updatedView: DataView = deepMerge
    ? deepMergeFn(view, update)
    : { ...view, ...update };

  // Re-index the item references within the updated config
  updatedView.references = extractDataViewReferences(updatedView.type, {
    options: updatedView.options,
    data: updatedView.data,
  });

  // If the ID is changing (virtual data views only), remove the old
  // entry and set the new one
  if ('id' in data && data.id && data.id !== id) {
    if (!view.virtual) {
      throw new InvalidParameterError(
        'Cannot change the ID of a non-virtual view',
      );
    }

    DataViewsStore.remove(id);
    DataViewsStore.set(updatedView);
  } else {
    // Update the data view in the store
    DataViewsStore.update(id, updatedView);
  }

  // Write the data view to the file system if not virtual
  if (!view.virtual) {
    await writeDataView(id);
  }

  // Get the updated data view from the store
  const finalView = getDataView(updatedView.id);

  // Dispatch a data view updated event
  Events.dispatch(DataViewUpdatedEvent, {
    original: view,
    updated: finalView,
  });

  // Return the updated data view
  return finalView;
}
