import { ViewCreatedEventData } from '@minddrop/views';
import { writeDatabaseViews } from '../../writeDatabaseViews';

/**
 * Called when a view is created. If the view belongs to a
 * database, persists the updated views to the database config.
 */
export function onDatabaseViewCreated(data: ViewCreatedEventData): void {
  if (data.dataSource.type === 'database') {
    writeDatabaseViews(data.dataSource.id);
  }
}
