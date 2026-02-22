import { createArrayStore } from '@minddrop/utils';
import { View, ViewDataSource } from './types';

export const ViewsStore = createArrayStore<View>('id');

/**
 * Retrieves a view by ID.
 *
 * @param id - The ID of the view to retrieve.
 * @returns The view or null if it doesn't exist.
 */
export const useView = (id: string): View | null => {
  return ViewsStore.useAllItems().find((view) => view.id === id) || null;
};

/**
 * Retrieves all views.
 *
 * @returns And array of all views.
 */
export const useViews = (): View[] => {
  return ViewsStore.useAllItems();
};

/**
 * Retrieves all views of a specific type.
 *
 * @param type - The type of views to retrieve.
 * @returns An array of views of the specified type.
 */
export const useViewsOfType = (type: string): View[] => {
  return useViews().filter((view) => view.type === type);
};

/**
 * Retrieves all views for a specific data source.
 *
 * @param type - The data source type.
 * @param id - The data source ID.
 * @returns An array of views.
 */
export const useDataSourceViews = (
  type: ViewDataSource['type'],
  id: string,
): View[] => {
  return useViews().filter(
    (view) => view.dataSource.type === type && view.dataSource.id === id,
  );
};
