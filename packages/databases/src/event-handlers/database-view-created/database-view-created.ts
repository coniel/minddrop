import { DataViewCreatedEventData } from '@minddrop/data-views';
import { isEntityId } from '@minddrop/utils';
import { writeDatabaseViews } from '../../writeDatabaseViews';

/**
 * Called when a view is created. If the view is owned by a
 * database, persists the updated views to the database config.
 */
export function onDatabaseViewCreated(data: DataViewCreatedEventData): void {
  if (data.owner && isEntityId(data.owner, 'database')) {
    writeDatabaseViews(data.owner);
  }
}
