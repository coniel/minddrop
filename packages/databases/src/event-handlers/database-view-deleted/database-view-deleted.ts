import { ViewDeletedEventData } from '@minddrop/views';
import { writeDatabaseViews } from '../../writeDatabaseViews';

/**
 * Called when a view is deleted. If the view belonged to a
 * database, persists the remaining views to the database config.
 */
export function onDatabaseViewDeleted(data: ViewDeletedEventData): void {
  if (data.dataSource.type === 'database') {
    writeDatabaseViews(data.dataSource.id);
  }
}
