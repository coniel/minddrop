import { Sql } from '@minddrop/sql';
import { Workspaces } from '@minddrop/workspaces';

/**
 * Retrieves a database's icon by its ID.
 *
 * @param databaseId - The ID of the database.
 * @param workspaceId - The ID of the workspace whose database to target. Defaults to the active workspace.
 */
export function sqlGetDatabaseIcon(
  databaseId: string,
  workspaceId?: string,
): string {
  const row = Sql.get<{ icon: string }>(
    workspaceId ?? Workspaces.getActive().id,
    'SELECT icon FROM databases WHERE id = ?',
    databaseId,
  );

  return row?.icon ?? '';
}
