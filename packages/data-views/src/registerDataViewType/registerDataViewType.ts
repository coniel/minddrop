import { Events } from '@minddrop/events';
import { DataViewTypesStore } from '../DataViewTypesStore';
import { DataViewTypeRegisteredEvent } from '../events';
import { DataViewType } from '../types';

/**
 * Registers a data view type, adding it to the store.
 *
 * @param viewType - The data view type to register.
 *
 * @dispatches 'data-views:data-view-type:registered' event
 */
export function registerDataViewType<
  TViewOptions extends object,
  TViewData extends object,
>(viewType: DataViewType<TViewOptions, TViewData>) {
  // Erase the view type's generics for storage and dispatch
  const erasedViewType = viewType as unknown as DataViewType;

  // Add the data view type to the store
  DataViewTypesStore.set(erasedViewType);

  // Dispatch the data view type registered event
  Events.dispatch(DataViewTypeRegisteredEvent, erasedViewType);
}
