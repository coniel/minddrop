import { DataViewTypesRegistry } from '../DataViewTypesRegistry';
import { DataViewType } from '../types';

/**
 * Registers a data view type.
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

  // Register the data view type
  DataViewTypesRegistry.register(erasedViewType);
}
