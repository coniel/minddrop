import { DataViewDeletedEventData } from '@minddrop/data-views';
import { isEntityId } from '@minddrop/utils';
import { writeDatabaseViews } from '../../writeDatabaseViews';

/**
 * Called when a view is deleted. If the view was owned by a
 * database, persists the remaining views to the database config.
 */
export function onDatabaseViewDeleted(data: DataViewDeletedEventData): void {
  if (data.owner && isEntityId(data.owner, 'database')) {
    writeDatabaseViews(data.owner);
  }
}
