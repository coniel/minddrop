import { Events } from '@minddrop/events';
import { DataViewTypesStore } from '../DataViewTypesStore';
import { DataViewTypeNotRegisteredError } from '../errors';
import { ViewTypeUnregisteredEvent } from '../events';

/**
 * Unregisters a data view type, removing it from the store.
 *
 * @param type - The type of the data view type to unregister.
 *
 * @throws {DataViewTypeNotRegisteredError} If the data view type is not registered.
 *
 * @dispatches 'views:view-type:unregistered' event
 */
export function unregisterDataViewType(type: string): void {
  // Get the data view type
  const viewType = DataViewTypesStore.get(type);

  // Ensure the data view type is registered
  if (!viewType) {
    throw new DataViewTypeNotRegisteredError(type);
  }

  // Remove the data view type from the store
  DataViewTypesStore.remove(type);

  // Dispatch the data view type unregistered event
  Events.dispatch(ViewTypeUnregisteredEvent, type);
}
