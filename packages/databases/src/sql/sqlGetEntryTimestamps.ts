import { Sql } from '@minddrop/sql';

/**
 * Returns a map of entry ID to last_modified timestamp for all
 * entries in the given database. Used to diff against fresh file
 * reads and skip unchanged entries on startup.
 */
export function sqlGetEntryTimestamps(databaseId: string): Map<string, number> {
  const rows = Sql.all<{ id: string; last_modified: number }>(
    'SELECT id, last_modified FROM entries WHERE database_id = ?',
    databaseId,
  );

  return new Map(rows.map((row) => [row.id, row.last_modified]));
}
