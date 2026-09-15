import { ContentViewsStore } from '../ContentViewsStore';
import { ContentView, ViewDataSource } from '../types';

/**
 * Retrieves all content views for a specific data source.
 *
 * @param type - The data source type.
 * @param id - The data source ID.
 * @param workspaceId - The workspace the content views belong to. Omit for the active workspace.
 * @returns An array of content views.
 */
export function getDataSourceContentViews(
  type: ViewDataSource['type'],
  id: string,
  workspaceId?: string,
): ContentView[] {
  return ContentViewsStore.in(workspaceId)
    .getAllArray()
    .filter(
      (view) => view.dataSource.type === type && view.dataSource.id === id,
    );
}
