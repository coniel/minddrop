import type { DatabaseUpdatedEventData } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { DatabaseSqlSyncedEvent } from '../events';
import type { DatabaseSqlSyncedEventData } from '../events';
import { upsertDatabase } from '../operations';

/**
 * Handles database updated events by syncing the updated
 * metadata to SQL and dispatching a synced event.
 */
export function onUpdateDatabase(data: DatabaseUpdatedEventData): void {
  const databaseRecord = {
    id: data.updated.id,
    name: data.updated.name,
    path: data.updated.path,
    icon: data.updated.icon,
  };

  // Upsert into SQL
  upsertDatabase(databaseRecord);

  // Dispatch synced event
  Events.dispatch<DatabaseSqlSyncedEventData>(DatabaseSqlSyncedEvent, {
    action: 'upsert',
    databaseId: data.updated.id,
    database: databaseRecord,
  });
}
