import { createObjectStore } from '@minddrop/stores';
import { DataView, ViewDataSource } from './types';

export const DataViewsStore = createObjectStore<DataView>(
  'Views:DataViews',
  'id',
);

/**
 * Retrieves a data view by ID.
 *
 * @param id - The ID of the data view to retrieve.
 * @returns The data view or null if it doesn't exist.
 */
export const useDataView = (id: string): DataView | null => {
  return DataViewsStore.useItem(id);
};

/**
 * Retrieves all data views.
 *
 * @returns An array of all data views.
 */
export const useDataViews = (): DataView[] => {
  return DataViewsStore.useAllItemsArray();
};

/**
 * Retrieves all data views of a specific type.
 *
 * @param type - The type of data views to retrieve.
 * @returns An array of data views of the specified type.
 */
export const useDataViewsOfType = (type: string): DataView[] => {
  return useDataViews().filter((view) => view.type === type);
};

/**
 * Retrieves all data views for a specific data source.
 *
 * @param type - The data source type.
 * @param id - The data source ID.
 * @returns An array of data views.
 */
export const useDataSourceDataViews = (
  type: ViewDataSource['type'],
  id: string,
): DataView[] => {
  return useDataViews().filter(
    (view) => view.dataSource.type === type && view.dataSource.id === id,
  );
};
