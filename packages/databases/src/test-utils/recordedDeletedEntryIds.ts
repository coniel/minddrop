import { getRecordedSqlStatements } from './createRecordingSqlAdapter';

/**
 * Returns the IDs of the entries deleted from SQL, read from the
 * recorded SQL statements.
 *
 * @returns The deleted entries' IDs, in deletion order.
 */
export function recordedDeletedEntryIds(): string[] {
  return (
    getRecordedSqlStatements()
      // Filter for the entry deletions
      .filter(
        (statement) => statement.sql === 'DELETE FROM entries WHERE id = ?',
      )
      // Read the entry ID off each deletion
      .map((statement) => String(statement.params[0]))
  );
}
