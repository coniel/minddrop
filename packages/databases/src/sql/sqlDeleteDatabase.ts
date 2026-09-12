import { Events } from '@minddrop/events';
import { Sql } from '@minddrop/sql';
import { Workspaces } from '@minddrop/workspaces';
import { DatabaseSqlSyncedEvent } from '../events';

/**
 * Deletes a database record from the databases table and
 * dispatches a DatabaseSqlSyncedEvent.
 *
 * @param workspaceId - The ID of the workspace whose database to target. Defaults to the active workspace.
 */
export function sqlDeleteDatabase(
  databaseId: string,
  options?: { silent?: boolean },
  workspaceId?: string,
): void {
  Sql.run(
    workspaceId ?? Workspaces.getActive().id,
    'DELETE FROM databases WHERE id = ?',
    databaseId,
  );

  // Dispatch SQL synced event unless silenced
  if (!options?.silent) {
    Events.dispatch(DatabaseSqlSyncedEvent, {
      action: 'delete',
      databaseId,
    });
  }
}
