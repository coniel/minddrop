import { Databases } from '@minddrop/databases';
import type { SqlEntryPropertyRecord } from '@minddrop/databases';
import {
  cleanupTestSqlDatabase,
  setupTestSqlDatabase,
} from '@minddrop/databases/test-utils';
import { Fs } from '@minddrop/file-system';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { Sql } from '@minddrop/sql';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { cancelDebouncedPersists } from '../debouncedPersist';
import { searchIndexes } from '../searchIndexStore';

const { workspace_1 } = WorkspaceFixtures;

// Mock file system backing index persistence in tests
export const MockFs = initializeMockFileSystem();

/**
 * The ID of the workspace whose SQL database the tests seed
 * and index.
 */
export const testWorkspaceId = workspace_1.id;

/**
 * A minimal entry description for seeding the in-memory SQL
 * database in tests.
 */
export interface TestEntrySeed {
  /**
   * The entry ID.
   */
  id: string;

  /**
   * The entry title.
   */
  title: string;

  /**
   * The entry's property values.
   */
  properties?: SqlEntryPropertyRecord[];
}

/**
 * Opens the in-memory SQL database the search index reads from,
 * for the `testWorkspaceId` workspace.
 */
export function setup(): void {
  setupTestSqlDatabase(testWorkspaceId);

  // Seed the data version counter, which `Sql.open` creates in
  // production but the in-memory test database lacks.
  Sql.run(
    testWorkspaceId,
    "INSERT OR IGNORE INTO meta (key, value) VALUES ('version', '0')",
  );
}

/**
 * Resets all state touched by search index tests.
 */
export async function cleanup(): Promise<void> {
  // Let in-flight file operations settle and reset the mock file
  // system before clearing the state they may still read.
  await Fs.tests.cleanup();

  // Cancel persists scheduled during the test
  cancelDebouncedPersists();

  // Close the in-memory SQL database
  cleanupTestSqlDatabase();

  // Drop all workspace indexes
  searchIndexes.clear();
}

/**
 * Seeds a database record into the in-memory SQL database
 * without dispatching sync events.
 *
 * @param database - The database record to seed.
 */
export function seedDatabase(database: {
  id: string;
  name: string;
  icon?: string;
}): void {
  Databases.sql.upsertDatabase(
    {
      id: database.id,
      name: database.name,
      path: `/databases/${database.id}`,
      icon: database.icon ?? '',
    },
    { silent: true },
    testWorkspaceId,
  );
}

/**
 * Seeds entries into the in-memory SQL database without
 * dispatching sync events.
 *
 * @param databaseId - The ID of the database the entries belong to.
 * @param entries - The entries to seed.
 */
export function seedEntries(
  databaseId: string,
  entries: TestEntrySeed[],
): void {
  Databases.sql.upsertEntries(
    databaseId,
    entries.map((entry) => ({
      id: entry.id,
      databaseId,
      path: `/entries/${entry.id}.md`,
      title: entry.title,
      created: 0,
      lastModified: 0,
      contentHash: '',
      metadata: '',
      properties: entry.properties ?? [],
    })),
    { silent: true },
    testWorkspaceId,
  );
}
