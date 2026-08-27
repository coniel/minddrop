import { DataViewUpdatedEventData } from '@minddrop/data-views';
import { isEntityId } from '@minddrop/utils';
import { writeDatabaseViews } from '../../writeDatabaseViews';

/**
 * Called when a view is updated. If the view is owned by a
 * database, persists the updated views to the database config.
 */
export function onDatabaseViewUpdated(data: DataViewUpdatedEventData): void {
  const { updated } = data;

  if (updated.owner && isEntityId(updated.owner, 'database')) {
    writeDatabaseViews(updated.owner);
  }
}
