import { Sql } from '@minddrop/sql';
import { Workspaces } from '@minddrop/workspaces';

/**
 * Retrieves all entries as summary objects, used for
 * building the MiniSearch index.
 *
 * @param workspaceId - The ID of the workspace whose database to target. Defaults to the active workspace.
 */
export function sqlGetAllEntries(workspaceId?: string): {
  id: string;
  databaseId: string;
  title: string;
}[] {
  return Sql.all<{ id: string; databaseId: string; title: string }>(
    workspaceId ?? Workspaces.getActive().id,
    'SELECT id, database_id as databaseId, title FROM entries',
  );
}
