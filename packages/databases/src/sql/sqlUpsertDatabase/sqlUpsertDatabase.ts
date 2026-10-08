import { Events } from '@minddrop/events';
import { PropertiesSchema } from '@minddrop/properties';
import { Sql } from '@minddrop/sql';
import { Workspaces } from '@minddrop/workspaces';
import { DatabaseSqlSyncedEvent } from '../../events';
import { hashDatabaseProperties } from '../../utils';

/**
 * Upserts a database record into the databases table. The database's
 * properties are stored as a hash.
 *
 * Updates the existing row in place rather than replacing it,
 * which would cascade delete the database's entries.
 *
 * @param databaseData - The database to upsert.
 * @param options - Upsert options. `silent` skips the dispatch.
 * @param workspaceId - The ID of the workspace whose database to target. Defaults to the active workspace.
 *
 * @dispatches databases:database:sql-synced
 */
export function sqlUpsertDatabase(
  databaseData: {
    id: string;
    name: string;
    path: string;
    icon: string;
    properties: PropertiesSchema;
  },
  options?: { silent?: boolean },
  workspaceId?: string,
): void {
  // Upsert the database row, with its properties' hash
  Sql.run(
    workspaceId ?? Workspaces.getActive().id,
    `INSERT INTO databases (id, name, path, icon, properties_hash) VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET name = excluded.name, path = excluded.path, icon = excluded.icon, properties_hash = excluded.properties_hash`,
    databaseData.id,
    databaseData.name,
    databaseData.path,
    databaseData.icon,
    hashDatabaseProperties(databaseData.properties),
  );

  // Dispatch SQL synced event unless silenced
  if (!options?.silent) {
    Events.dispatch(DatabaseSqlSyncedEvent, {
      action: 'upsert',
      databaseId: databaseData.id,
      database: {
        id: databaseData.id,
        name: databaseData.name,
        path: databaseData.path,
        icon: databaseData.icon,
      },
    });
  }
}
