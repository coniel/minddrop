import { Sql } from '@minddrop/sql';
import { SCHEMA_SQL } from '../sql/schema';
import { createTestSqlAdapter } from './createTestSqlAdapter';

/**
 * Opens an in-memory SQL database containing the databases
 * schema, allowing code which reads from SQL to run in tests.
 */
export function setupTestSqlDatabase(): void {
  // Back the connection with an in-memory database
  Sql.registerAdapter(createTestSqlAdapter());
  Sql.initialize();

  // Create the tables SQL reads and writes go through
  Sql.exec(SCHEMA_SQL);
}

/**
 * Closes the in-memory SQL database opened by
 * `setupTestSqlDatabase`.
 */
export function cleanupTestSqlDatabase(): void {
  Sql.close();
}
