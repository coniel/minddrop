import { DataViewTypesStore } from './DataViewTypesStore';
import { DataViewType } from './types';

/**
 * Returns all registered data view types.
 */
export function getDataViewTypes(): DataViewType[] {
  return DataViewTypesStore.getAllArray();
}
