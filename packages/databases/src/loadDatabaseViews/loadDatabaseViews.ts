import {
  DataViews,
  VirtualDataViewData,
  resolveDataViewConfig,
} from '@minddrop/views';
import type { Database } from '../types';

/**
 * Loads database views into the ViewsStore as virtual views.
 *
 * @param databases - The databases whose views to load.
 */
export function loadDatabaseViews(databases: Database[]): void {
  // Build VirtualDataViewData from each database's stored views
  const viewData: VirtualDataViewData[] = databases.flatMap((database) => {
    if (!database.views) {
      return [];
    }

    return database.views.map((storedView) => ({
      ...storedView,
      // Resolve the stored config's durable references into item IDs
      ...resolveDataViewConfig(storedView.type, {
        options: storedView.options,
        data: storedView.data,
      }),
      dataSource: { type: 'database' as const, id: database.id },
    }));
  });

  if (viewData.length === 0) {
    return;
  }

  // Load views via the DataViews API
  DataViews.loadVirtual(viewData);
}
