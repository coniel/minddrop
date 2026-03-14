import { Views, VirtualViewData } from '@minddrop/views';
import type { Database } from '../types';

/**
 * Loads database views into the ViewsStore as virtual views.
 *
 * @param databases - The databases whose views to load.
 */
export function loadDatabaseViews(databases: Database[]): void {
  // Build VirtualViewData from each database's stored views
  const viewData: VirtualViewData[] = databases.flatMap((database) => {
    if (!database.views) {
      return [];
    }

    return database.views.map((storedView) => ({
      ...storedView,
      dataSource: { type: 'database' as const, id: database.id },
    }));
  });

  if (viewData.length === 0) {
    return;
  }

  // Load views via the Views API
  Views.loadVirtual(viewData);
}
