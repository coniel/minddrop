import { DataViewsStore } from '../DataViewsStore';
import { DataView, ViewDataSource } from '../types';

/**
 * Retrieves all data views for a specific data source.
 *
 * @param type - The data source type.
 * @param id - The data source ID.
 * @returns An array of data views.
 */
export function getDataSourceDataViews(
  type: ViewDataSource['type'],
  id: string,
): DataView[] {
  return DataViewsStore.getAllArray().filter(
    (view) => view.dataSource.type === type && view.dataSource.id === id,
  );
}
