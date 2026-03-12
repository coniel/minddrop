import type { DatabaseCreatedEventData } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { DatabaseSqlSyncedEvent } from '../events';
import type { DatabaseSqlSyncedEventData } from '../events';
import { upsertDatabase } from '../operations';

/**
 * Handles database created events by syncing the database
 * metadata to SQL and dispatching a synced event.
 */
export function onCreateDatabase(data: DatabaseCreatedEventData): void {
  const databaseRecord = {
    id: data.id,
    name: data.name,
    path: data.path,
    icon: data.icon,
  };

  // Upsert into SQL
  upsertDatabase(databaseRecord);

  // Dispatch synced event
  Events.dispatch<DatabaseSqlSyncedEventData>(DatabaseSqlSyncedEvent, {
    action: 'upsert',
    databaseId: data.id,
    database: databaseRecord,
  });
}
