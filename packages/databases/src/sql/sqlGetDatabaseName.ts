import { Sql } from '@minddrop/sql';
import { Workspaces } from '@minddrop/workspaces';

/**
 * Retrieves a database name by its ID.
 *
 * @param databaseId - The ID of the database.
 * @param workspaceId - The ID of the workspace whose database to target. Defaults to the active workspace.
 */
export function sqlGetDatabaseName(
  databaseId: string,
  workspaceId?: string,
): string | null {
  const row = Sql.get<{ name: string }>(
    workspaceId ?? Workspaces.getActive().id,
    'SELECT name FROM databases WHERE id = ?',
    databaseId,
  );

  return row?.name ?? null;
}
