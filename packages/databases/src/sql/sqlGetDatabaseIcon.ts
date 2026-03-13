import { Sql } from '@minddrop/sql';

/**
 * Retrieves a database's icon by its ID.
 */
export function sqlGetDatabaseIcon(databaseId: string): string {
  const row = Sql.get<{ icon: string }>(
    'SELECT icon FROM databases WHERE id = ?',
    databaseId,
  );

  return row?.icon ?? '';
}
