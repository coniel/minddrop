import { Sql } from '@minddrop/sql';
import { SCHEMA_SQL } from '../sql/schema';
import {
  clearRecordedSqlStatements,
  createRecordingSqlAdapter,
} from './createRecordingSqlAdapter';
import {
  type TestSqlAdapter,
  createTestSqlAdapter,
} from './createTestSqlAdapter';

// The adapter backing the current test's databases
let adapter: TestSqlAdapter | null = null;

/**
 * Opens an in-memory SQL database containing the databases
 * schema, allowing code which reads from SQL to run in tests.
 *
 * The databases are kept for as long as the test runs, so
 * reopening one models a restart rather than a fresh install.
 */
export function setupTestSqlDatabase(): void {
  // Back the connection with an in-memory database
  adapter = createTestSqlAdapter();
  Sql.registerAdapter(adapter);
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
  disposeAdapter();
}

/**
 * Opens an in-memory SQL database containing the databases
 * schema which records every executed statement, allowing tests
 * to assert SQL side effects via `getRecordedSqlStatements`.
 */
export function setupRecordingTestSqlDatabase(): void {
  // Back the connection with a recording in-memory database
  adapter = createRecordingSqlAdapter();
  Sql.registerAdapter(adapter);
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
  disposeAdapter();
  clearRecordedSqlStatements();
}

/**
 * Discards the databases opened through the current test's
 * adapter, which outlive the connections opened onto them.
 */
function disposeAdapter(): void {
  adapter?.dispose();
  adapter = null;
}
