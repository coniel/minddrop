import { DataViewsStore } from '../DataViewsStore';
import { DataView } from '../types';

/**
 * Retrieves all data views of the given type, typed with the view
 * type's options and data.
 *
 * @param type - The view type to retrieve the data views of.
 * @returns The data views of the given type.
 */
export function getDataViewsOfType<
  TViewOptions extends object = object,
  TViewData extends object = object,
>(type: string): DataView<TViewOptions, TViewData>[] {
  // Filter views down to those of the given type
  return DataViewsStore.getAllArray().filter(
    (view) => view.type === type,
  ) as DataView<TViewOptions, TViewData>[];
}
