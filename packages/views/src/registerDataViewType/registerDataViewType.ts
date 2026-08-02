import { Events } from '@minddrop/events';
import { DataViewTypesStore } from '../DataViewTypesStore';
import { ViewTypeRegisteredEvent } from '../events';
import { DataViewType } from '../types';

/**
 * Registers a data view type, adding it to the store.
 *
 * @param viewType - The data view type to register.
 *
 * @dispatches 'views:view-type:registered' event
 */
export function registerDataViewType(viewType: DataViewType<any>) {
  // Add the data view type to the store
  DataViewTypesStore.set(viewType);

  // Dispatch the data view type registered event
  Events.dispatch(ViewTypeRegisteredEvent, viewType);
}
