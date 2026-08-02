import { createObjectStore } from '@minddrop/stores';
import { DataViewType } from './types';

export const DataViewTypesStore = createObjectStore<DataViewType>(
  'Views:DataViewTypes',
  'type',
);

/**
 * Retrieves a data view type by its type.
 *
 * @param type - The type of the data view type to retrieve.
 * @returns The data view type or null if it doesn't exist.
 */
export const useDataViewType = (type: string): DataViewType | null => {
  return DataViewTypesStore.useItem(type);
};

/**
 * Retrieves all data view types.
 *
 * @returns An array of all data view types.
 */
export const useDataViewTypes = (): DataViewType[] => {
  return DataViewTypesStore.useAllItemsArray();
};
