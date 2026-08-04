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
export function registerDataViewType<
  TViewOptions extends object,
  TViewData extends object,
>(viewType: DataViewType<TViewOptions, TViewData>) {
  // Add the data view type to the store, erasing its generics
  DataViewTypesStore.set(viewType as unknown as DataViewType);

  // Dispatch the data view type registered event
  Events.dispatch(ViewTypeRegisteredEvent, viewType);
}
