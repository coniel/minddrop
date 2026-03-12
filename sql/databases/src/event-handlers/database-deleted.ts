import type { DatabaseDeletedEventData } from '@minddrop/databases';
import { Events } from '@minddrop/events';
import { DatabaseSqlSyncedEvent } from '../events';
import type { DatabaseSqlSyncedEventData } from '../events';
import { deleteDatabase } from '../operations';

/**
 * Handles database deleted events by removing the database
 * from SQL and dispatching a synced event.
 */
export function onDeleteDatabase(data: DatabaseDeletedEventData): void {
  // Delete from SQL
  deleteDatabase(data.id);

  // Dispatch synced event
  Events.dispatch<DatabaseSqlSyncedEventData>(DatabaseSqlSyncedEvent, {
    action: 'delete',
    databaseId: data.id,
  });
}
