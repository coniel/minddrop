import { DataViews } from '@minddrop/data-views';
import { entityId } from '@minddrop/utils';
import { DatabaseCreatedEventData } from '../../events';
import { sqlUpsertDatabase } from '../../sql';

/**
 * Called when a database is created. Syncs to SQL and
 * creates a default virtual table view.
 */
export function onCreateDatabase(data: DatabaseCreatedEventData) {
  // Create a virtual view for the database
  DataViews.createVirtual({
    id: entityId('data-view'),
    type: 'table',
    dataSource: { type: 'database', id: data.id },
    owner: data.id,
  });

  // Sync to SQL
  sqlUpsertDatabase({
    id: data.id,
    name: data.name,
    path: data.path,
    icon: data.icon,
  });
}
