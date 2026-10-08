import { Sql } from '@minddrop/sql';
import { Workspaces } from '@minddrop/workspaces';

export interface SqlGetEntrySummariesOptions {
  /**
   * The ID of the database to limit the read to.
   */
  databaseId?: string;
}

/**
 * Retrieves entries as summary objects.
 *
 * @param options - The database to limit the read to.
 * @param workspaceId - The ID of the workspace whose database to target. Defaults to the active workspace.
 * @returns The entries' IDs, database IDs and titles.
 */
export function sqlGetEntrySummaries(
  options: SqlGetEntrySummariesOptions = {},
  workspaceId?: string,
): {
  id: string;
  databaseId: string;
  title: string;
}[] {
  // Limit the read to the database if one is given
  const filter = options.databaseId ? 'WHERE database_id = ?' : '';
  const params = options.databaseId ? [options.databaseId] : [];

  // Read the entries
  return Sql.all<{ id: string; databaseId: string; title: string }>(
    workspaceId ?? Workspaces.getActive().id,
    `SELECT id, database_id as databaseId, title FROM entries ${filter}`,
    ...params,
  );
}
