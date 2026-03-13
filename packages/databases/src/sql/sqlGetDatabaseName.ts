import { Sql } from '@minddrop/sql';

/**
 * Retrieves a database name by its ID.
 */
export function sqlGetDatabaseName(databaseId: string): string | null {
  const row = Sql.get<{ name: string }>(
    'SELECT name FROM databases WHERE id = ?',
    databaseId,
  );

  return row?.name ?? null;
}
