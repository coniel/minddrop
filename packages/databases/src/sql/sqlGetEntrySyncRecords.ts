import { Sql } from '@minddrop/sql';
import { EntrySyncRecord } from '../types';

/**
 * Returns the ID, path, and last modified timestamp of all entries
 * in the given database. Used to diff against fresh file reads
 * during background sync.
 */
export function sqlGetEntrySyncRecords(databaseId: string): EntrySyncRecord[] {
  const rows = Sql.all<{ id: string; path: string; last_modified: number }>(
    'SELECT id, path, last_modified FROM entries WHERE database_id = ?',
    databaseId,
  );

  return rows.map((row) => ({
    id: row.id,
    path: row.path,
    lastModified: row.last_modified,
  }));
}
