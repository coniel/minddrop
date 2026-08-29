import { Databases } from '@minddrop/databases';
import type { SqlEntryPropertyRecord } from '@minddrop/databases';
import {
  cleanupTestSqlDatabase,
  setupTestSqlDatabase,
} from '@minddrop/databases/test-utils';
import { initializeMockFileSystem } from '@minddrop/file-system/test-utils';
import { Sql } from '@minddrop/sql';
import { cancelDebouncedPersists } from '../debouncedPersist';
import { searchIndexes } from '../searchIndexStore';

// Mock file system backing index persistence in tests
export const MockFs = initializeMockFileSystem();

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
 * Opens the in-memory SQL database the search index reads from.
 */
export function setup(): void {
  setupTestSqlDatabase();

  // Seed the data version counter, which `Sql.open` creates in
  // production but the in-memory test database lacks
  Sql.run("INSERT OR IGNORE INTO meta (key, value) VALUES ('version', '0')");
}

/**
 * Resets all state touched by search index tests.
 */
export function cleanup(): void {
  // Cancel persists scheduled during the test
  cancelDebouncedPersists();

  // Close the in-memory SQL database
  cleanupTestSqlDatabase();

  // Drop all workspace indexes
  searchIndexes.clear();

  // Clear mock file system contents
  MockFs.reset();
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
  );
}
