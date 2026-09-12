import { Events } from '@minddrop/events';
import { Sql } from '@minddrop/sql';
import { Workspaces } from '@minddrop/workspaces';
import { DatabaseSqlSyncedEvent } from '../../events';

/**
 * Upserts a database record into the databases table and
 * dispatches a DatabaseSqlSyncedEvent.
 *
 * Updates the existing row in place rather than replacing it,
 * which would cascade delete the database's entries.
 *
 * @param workspaceId - The ID of the workspace whose database to target. Defaults to the active workspace.
 */
export function sqlUpsertDatabase(
  databaseData: {
    id: string;
    name: string;
    path: string;
    icon: string;
  },
  options?: { silent?: boolean },
  workspaceId?: string,
): void {
  Sql.run(
    workspaceId ?? Workspaces.getActive().id,
    `INSERT INTO databases (id, name, path, icon) VALUES (?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET name = excluded.name, path = excluded.path, icon = excluded.icon`,
    databaseData.id,
    databaseData.name,
    databaseData.path,
    databaseData.icon,
  );

  // Dispatch SQL synced event unless silenced
  if (!options?.silent) {
    Events.dispatch(DatabaseSqlSyncedEvent, {
      action: 'upsert',
      databaseId: databaseData.id,
      database: databaseData,
    });
  }
}
