import { Events } from '@minddrop/events';
import { Views } from '@minddrop/views';
import { DatabaseCreatedEventData, DatabaseSqlSyncedEvent } from '../../events';
import type { DatabaseSqlSyncedEventData } from '../../events';
import { upsertDatabase } from '../../sql';

/**
 * Called when a database is created. Syncs to SQL and
 * creates a default table view.
 */
export function onCreateDatabase(data: DatabaseCreatedEventData) {
  // Sync to SQL
  const databaseRecord = {
    id: data.id,
    name: data.name,
    path: data.path,
    icon: data.icon,
  };

  upsertDatabase(databaseRecord);

  // Dispatch SQL synced event
  Events.dispatch<DatabaseSqlSyncedEventData>(DatabaseSqlSyncedEvent, {
    action: 'upsert',
    databaseId: data.id,
    database: databaseRecord,
  });

  // Create a new view for the database
  Views.create('table', {
    type: 'database',
    id: data.id,
  });
}
