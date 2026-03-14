import { ViewsStore } from './ViewsStore';
import { View, ViewDataSource } from './types';

/**
 * Retrieves all views for a specific data source.
 *
 * @param type - The data source type.
 * @param id - The data source ID.
 * @returns An array of views.
 */
export function getDataSourceViews(
  type: ViewDataSource['type'],
  id: string,
): View[] {
  return ViewsStore.getAll().filter(
    (view) => view.dataSource.type === type && view.dataSource.id === id,
  );
}
