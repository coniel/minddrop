import { createObjectStore } from '@minddrop/stores';
import { ContentView, ViewDataSource } from './types';

export const ContentViewsStore = createObjectStore<ContentView>(
  'Views:ContentViews',
  'id',
  { scope: 'workspace' },
);

/**
 * Retrieves a content view by ID.
 *
 * @param id - The ID of the content view to retrieve.
 * @returns The content view or null if it doesn't exist.
 */
export const useContentView = (id: string): ContentView | null => {
  return ContentViewsStore.useItem(id);
};

/**
 * Retrieves all content views.
 *
 * @returns An array of all content views.
 */
export const useContentViews = (): ContentView[] => {
  return ContentViewsStore.useAllItemsArray();
};

/**
 * Retrieves all content views of a specific type.
 *
 * @param type - The type of content views to retrieve.
 * @returns An array of content views of the specified type.
 */
export const useContentViewsOfType = (type: string): ContentView[] => {
  return useContentViews().filter((view) => view.type === type);
};

/**
 * Retrieves all content views for a specific data source.
 *
 * @param type - The data source type.
 * @param id - The data source ID.
 * @returns An array of content views.
 */
export const useDataSourceContentViews = (
  type: ViewDataSource['type'],
  id: string,
): ContentView[] => {
  return useContentViews().filter(
    (view) => view.dataSource.type === type && view.dataSource.id === id,
  );
};
