import { Events } from '@minddrop/events';
import { Sql } from '@minddrop/sql';
import { DatabaseSqlSyncedEvent } from '../events';
import type { DatabaseSqlSyncedEventData } from '../events';

/**
 * Deletes a database record from the databases table and
 * dispatches a DatabaseSqlSyncedEvent.
 */
export function sqlDeleteDatabase(
  databaseId: string,
  options?: { silent?: boolean },
): void {
  Sql.run('DELETE FROM databases WHERE id = ?', databaseId);

  // Dispatch SQL synced event unless silenced
  if (!options?.silent) {
    Events.dispatch<DatabaseSqlSyncedEventData>(DatabaseSqlSyncedEvent, {
      action: 'delete',
      databaseId,
    });
  }
}
