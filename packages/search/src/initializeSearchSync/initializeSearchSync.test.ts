import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Events } from '@minddrop/events';
import {
  cleanupWorkspaceFixtures,
  setupWorkspaceFixtures,
} from '@minddrop/workspaces/test-utils';
import { cancelDebouncedPersists } from '../debouncedPersist';
import { initializeSearchIndex } from '../initializeSearchIndex';
import { rebuildSearchIndex } from '../rebuildSearchIndex';
import { searchFullTextIndex } from '../searchFullTextIndex';
import { searchIndexes } from '../searchIndexStore';
import { clearSearchSyncBatch, flushSearchSyncBatch } from '../searchSyncBatch';
import {
  MockFs,
  SqlDatabaseSeed,
  cleanup,
  registerBackendSearchAdapter,
  seedDatabase,
  seedEntries,
  setup,
  testWorkspaceId,
} from '../test-utils';
import { initializeSearchSync } from './initializeSearchSync';

const { objectDatabase, objectEntry1 } = DatabaseFixtures;

const workspaceId = testWorkspaceId;

describe('initializeSearchSync', () => {
  // The seeded database's SQL record
  let database: SqlDatabaseSeed;

  beforeEach(async () => {
    // Set up the workspace, the search adapter and the sync listeners
    setup();
    setupWorkspaceFixtures(MockFs);
    registerBackendSearchAdapter();
    initializeSearchSync();

    // Seed a database with an entry and build the index
    database = seedDatabase(objectDatabase);
    seedEntries(database.id, [
      { id: objectEntry1.id, title: objectEntry1.title },
    ]);

    await rebuildSearchIndex(workspaceId);
  });

  afterEach(async () => {
    // Clear the sync batch, the listeners, the workspace and the index
    clearSearchSyncBatch();
    await Events.tests.cleanup();
    cleanupWorkspaceFixtures();
    await cleanup();
  });

  // Pins Issue 57: Deleting a database leaves all of its entries in the
  // search index. Remove .fails once fixed.
  it.fails(
    'drops the entries of a deleted database from the index',
    async () => {
      // Delete the database as the in-app delete does
      Databases.sql.deleteDatabase(database.id, undefined, workspaceId);

      // Wait for the sync
      await settleSearchSync();

      expect(searchFullTextIndex(workspaceId, objectEntry1.title)).toEqual([]);
    },
  );

  // Kept apart from the pin below, which passes on any failure. A
  // rename which never reaches the index fails this test instead of
  // passing as the pinned bug.
  it('finds a database by the name it was renamed to', async () => {
    await renameDatabase(database);

    expect(
      searchFullTextIndex(workspaceId, 'reading').map(({ id }) => id),
    ).toContain(database.id);
  });

  // Pins Issue 67: A database rename is lost from the search index if the
  // app quits before the persist. Remove .fails once fixed.
  it.fails(
    'finds a database by the name it was renamed to just before the app quit',
    async () => {
      await renameDatabase(database);

      // Quit before the debounced persist runs, then start up again.
      // Quitting drops the in-memory index.
      cancelDebouncedPersists();
      searchIndexes.clear();
      await initializeSearchIndex(workspaceId);

      expect(
        searchFullTextIndex(workspaceId, 'reading').map(({ id }) => id),
      ).toContain(database.id);
    },
  );

  // Pins Issue 72: Any database settings change re-indexes every entry of
  // the database in search. Remove .fails once fixed.
  it.fails(
    'leaves entry documents alone when a database is synced with its name and icon unchanged',
    async () => {
      // Change the entry's title in SQL without a sync event. Only a
      // re-index of the entry would pick the change up.
      seedEntries(database.id, [{ id: objectEntry1.id, title: 'Messiah' }]);

      // Sync the database unchanged, as a settings change does
      Databases.sql.upsertDatabase(database, undefined, workspaceId);

      // Wait for the sync
      await settleSearchSync();

      expect(searchFullTextIndex(workspaceId, 'messiah')).toEqual([]);
    },
  );
});

/**
 * Renames a database to 'Reading' and waits for the sync.
 *
 * @param database - The database's SQL record.
 */
async function renameDatabase(database: SqlDatabaseSeed): Promise<void> {
  // Rename the database
  Databases.sql.upsertDatabase(
    { ...database, name: 'Reading' },
    undefined,
    workspaceId,
  );

  // Wait for the sync
  await settleSearchSync();
}

/**
 * Waits for the sync listeners to run, then sends the buffered
 * entry updates to the index.
 */
async function settleSearchSync(): Promise<void> {
  // Wait for the sync listeners
  await Events.tests.awaitAllListeners();

  // Send the buffered entry updates to the index
  flushSearchSyncBatch();
}
