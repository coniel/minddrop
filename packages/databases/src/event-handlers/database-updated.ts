import { Events } from '@minddrop/events';
import { DatabaseSqlSyncedEvent, DatabaseUpdatedEventData } from '../events';
import type { DatabaseSqlSyncedEventData } from '../events';
import { upsertDatabase } from '../sql';

/**
 * Called when a database is updated. Syncs the updated
 * metadata to SQL and dispatches a synced event.
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

  // Dispatch SQL synced event
  Events.dispatch<DatabaseSqlSyncedEventData>(DatabaseSqlSyncedEvent, {
    action: 'upsert',
    databaseId: data.updated.id,
    database: databaseRecord,
  });
}
