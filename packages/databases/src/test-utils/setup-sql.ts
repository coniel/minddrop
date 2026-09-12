import { Sql } from '@minddrop/sql';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { SCHEMA_SQL } from '../sql/schema';
import {
  clearRecordedSqlStatements,
  createRecordingSqlAdapter,
} from './createRecordingSqlAdapter';
import {
  type TestSqlAdapter,
  createTestSqlAdapter,
} from './createTestSqlAdapter';

const { workspace_1 } = WorkspaceFixtures;

// The adapter backing the current test's databases
let adapter: TestSqlAdapter | null = null;

/**
 * Opens an in-memory SQL database containing the databases
 * schema, allowing code which reads from SQL to run in tests.
 *
 * The databases are kept for as long as the test runs, so
 * reopening one models a restart rather than a fresh install.
 *
 * @param workspaceId - The ID of the workspace to open the database for. Defaults to the `workspace_1` fixture.
 */
export function setupTestSqlDatabase(workspaceId?: string): void {
  // Back the connection with an in-memory database
  adapter = createTestSqlAdapter();
  Sql.registerAdapter(adapter);

  createSchema(workspaceId ?? workspace_1.id);
}

/**
 * Closes the in-memory SQL database opened by
 * `setupTestSqlDatabase`.
 */
export function cleanupTestSqlDatabase(): void {
  Sql.closeAll();
  disposeAdapter();
}

/**
 * Opens an in-memory SQL database containing the databases
 * schema which records every executed statement, allowing tests
 * to assert SQL side effects via `getRecordedSqlStatements`.
 *
 * @param workspaceId - The ID of the workspace to open the database for. Defaults to the `workspace_1` fixture.
 */
export function setupRecordingTestSqlDatabase(workspaceId?: string): void {
  // Back the connection with a recording in-memory database
  adapter = createRecordingSqlAdapter();
  Sql.registerAdapter(adapter);

  createSchema(workspaceId ?? workspace_1.id);

  // Drop the schema statement so tests only see their own SQL
  clearRecordedSqlStatements();
}

/**
 * Closes the in-memory SQL database opened by
 * `setupRecordingTestSqlDatabase` and clears the statement log.
 */
export function cleanupRecordingTestSqlDatabase(): void {
  Sql.closeAll();
  disposeAdapter();
  clearRecordedSqlStatements();
}

/**
 * Opens a workspace's connection and creates the tables SQL
 * reads and writes go through.
 */
function createSchema(workspaceId: string): void {
  Sql.connect(workspaceId);
  Sql.exec(workspaceId, SCHEMA_SQL);
}

/**
 * Discards the databases opened through the current test's
 * adapter, which outlive the connections opened onto them.
 */
function disposeAdapter(): void {
  adapter?.dispose();
  adapter = null;
}
