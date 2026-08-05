import { DataViewUpdatedEventData } from '@minddrop/data-views';
import { writeDatabaseViews } from '../../writeDatabaseViews';

/**
 * Called when a view is updated. If the view is a virtual
 * database view, persists the updated views to the database config.
 */
export function onDatabaseViewUpdated(data: DataViewUpdatedEventData): void {
  const { updated } = data;

  if (updated.virtual && updated.dataSource.type === 'database') {
    writeDatabaseViews(updated.dataSource.id);
  }
}
