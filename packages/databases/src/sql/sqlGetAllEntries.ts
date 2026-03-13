import { Sql } from '@minddrop/sql';

/**
 * Retrieves all entries as summary objects, used for
 * building the MiniSearch index.
 */
export function sqlGetAllEntries(): {
  id: string;
  databaseId: string;
  title: string;
}[] {
  return Sql.all<{ id: string; databaseId: string; title: string }>(
    'SELECT id, database_id as databaseId, title FROM entries',
  );
}
