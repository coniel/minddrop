import { Sql } from '@minddrop/sql';
import { EntrySyncRecord } from '../types';

/**
 * Returns the ID, path, last modified timestamp, and content hash of
 * all entries in the given database. Used to diff against fresh file
 * reads during background sync.
 */
export function sqlGetEntrySyncRecords(databaseId: string): EntrySyncRecord[] {
  const rows = Sql.all<{
    id: string;
    path: string;
    last_modified: number;
    content_hash: string;
  }>(
    'SELECT id, path, last_modified, content_hash FROM entries WHERE database_id = ?',
    databaseId,
  );

  return rows.map((row) => ({
    id: row.id,
    path: row.path,
    lastModified: row.last_modified,
    contentHash: row.content_hash,
  }));
}
