import { Sql } from '@minddrop/sql';
import { SCHEMA_SQL } from '../sql/schema';
import {
  clearRecordedSqlStatements,
  createRecordingSqlAdapter,
} from './createRecordingSqlAdapter';
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

/**
 * Opens an in-memory SQL database containing the databases
 * schema which records every executed statement, allowing tests
 * to assert SQL side effects via `getRecordedSqlStatements`.
 */
export function setupRecordingTestSqlDatabase(): void {
  // Back the connection with a recording in-memory database
  Sql.registerAdapter(createRecordingSqlAdapter());
  Sql.initialize();

  // Create the tables SQL reads and writes go through
  Sql.exec(SCHEMA_SQL);

  // Drop the schema statement so tests only see their own SQL
  clearRecordedSqlStatements();
}

/**
 * Closes the in-memory SQL database opened by
 * `setupRecordingTestSqlDatabase` and clears the statement log.
 */
export function cleanupRecordingTestSqlDatabase(): void {
  Sql.close();
  clearRecordedSqlStatements();
}
