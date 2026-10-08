import { Sql } from '@minddrop/sql';
import { Workspaces } from '@minddrop/workspaces';
import { EntryId, EntrySyncRecord } from '../types';

/**
 * Returns the sync records of all entries in the given database.
 *
 * @param databaseId - The ID of the database.
 * @param workspaceId - The ID of the workspace whose database to target. Defaults to the active workspace.
 * @returns The database's entry sync records.
 */
export function sqlGetEntrySyncRecords(
  databaseId: string,
  workspaceId?: string,
): EntrySyncRecord[] {
  // Query the database's entry rows
  const rows = Sql.all<{
    id: EntryId;
    path: string;
    last_modified: number;
    content_hash: string;
    metadata: string;
  }>(
    workspaceId ?? Workspaces.getActive().id,
    'SELECT id, path, last_modified, content_hash, metadata FROM entries WHERE database_id = ?',
    databaseId,
  );

  // Convert the rows to sync records
  return rows.map((row) => ({
    id: row.id,
    path: row.path,
    lastModified: row.last_modified,
    contentHash: row.content_hash,
    metadata: row.metadata,
  }));
}
