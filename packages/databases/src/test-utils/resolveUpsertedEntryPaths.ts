import { getRecordedSqlStatements } from './createRecordingSqlAdapter';

/**
 * Returns the paths of the entries upserted into a database, read
 * from the recorded SQL statements.
 *
 * @param databaseId - The ID of the database.
 * @returns The upserted entries' paths, in upsert order.
 */
export function resolveUpsertedEntryPaths(databaseId: string): string[] {
  // Read the upserted entry paths from the recorded statements
  return (
    getRecordedSqlStatements()
      // Filter for the entry upserts into the database
      .filter(
        (statement) =>
          statement.sql.includes('INSERT OR REPLACE INTO entries') &&
          statement.params[1] === databaseId,
      )
      // Read the entry path off each upsert
      .map((statement) => String(statement.params[2]))
  );
}
