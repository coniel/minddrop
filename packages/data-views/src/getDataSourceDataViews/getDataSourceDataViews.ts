import { DataViewsStore } from '../DataViewsStore';
import { DataView, ViewDataSource } from '../types';

/**
 * Retrieves all data views for a specific data source.
 *
 * @param type - The data source type.
 * @param id - The data source ID.
 * @param workspaceId - The workspace the data views belong to. Omit for the active workspace.
 * @returns An array of data views.
 */
export function getDataSourceDataViews(
  type: ViewDataSource['type'],
  id: string,
  workspaceId?: string,
): DataView[] {
  return DataViewsStore.in(workspaceId)
    .getAllArray()
    .filter(
      (view) => view.dataSource.type === type && view.dataSource.id === id,
    );
}
