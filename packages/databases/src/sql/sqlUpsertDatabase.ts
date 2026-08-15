import { Events } from '@minddrop/events';
import { Sql } from '@minddrop/sql';
import { DatabaseSqlSyncedEvent } from '../events';
import type { DatabaseSqlSyncedEventData } from '../events';

/**
 * Upserts a database record into the databases table and
 * dispatches a DatabaseSqlSyncedEvent.
 *
 * Updates the existing row in place rather than replacing it,
 * which would cascade delete the database's entries.
 */
export function sqlUpsertDatabase(
  databaseData: {
    id: string;
    name: string;
    path: string;
    icon: string;
  },
  options?: { silent?: boolean },
): void {
  Sql.run(
    `INSERT INTO databases (id, name, path, icon) VALUES (?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET name = excluded.name, path = excluded.path, icon = excluded.icon`,
    databaseData.id,
    databaseData.name,
    databaseData.path,
    databaseData.icon,
  );

  // Dispatch SQL synced event unless silenced
  if (!options?.silent) {
    Events.dispatch<DatabaseSqlSyncedEventData>(DatabaseSqlSyncedEvent, {
      action: 'upsert',
      databaseId: databaseData.id,
      database: databaseData,
    });
  }
}
