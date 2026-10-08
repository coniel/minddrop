import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { FileSystemChange, Fs } from '@minddrop/file-system';
import {
  CountingMockFileSystem,
  registerCountingMockFileSystem,
} from '@minddrop/file-system/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { createEntry } from '../../createEntry';
import { deleteEntry } from '../../deleteEntry';
import { initializeDatabaseEventHandlers } from '../../initializeDatabaseEventHandlers';
import { renameEntry } from '../../renameEntry';
import { syncDatabaseConfigs, syncEntryFiles } from '../../sql';
import {
  DatabaseFixtures,
  MockBackendAdapter,
  MockFs,
  appendToEntryFile,
  cleanup,
  cleanupRecordingTestSqlDatabase,
  cleanupTestSqlDatabase,
  createEntryFileChange,
  createMockBackendAdapter,
  databaseConfigFile,
  entryFilePath,
  flushFileSystemChangeDebounces,
  indexAtCurrentContents,
  seedSqlDatabases,
  setup,
  setupRecordingTestSqlDatabase,
  setupTestSqlDatabase,
} from '../../test-utils';
import { updateEntryProperty } from '../../updateEntryProperty';
import { writePropertyFile } from '../../writePropertyFile';

const { workspace_1 } = WorkspaceFixtures;
const {
  commonStorageEntry1,
  databases,
  entries,
  entryStorageEntry1,
  genericFilePropertyName,
  imagePropertyName,
  objectDatabase,
  objectEntry1,
  parentDir,
  propertyStorageEntry1,
  rootStorageEntry1,
} = DatabaseFixtures;

describe('amplification', () => {
  // The counted file system operations
  let counts: CountingMockFileSystem;

  describe('with the watcher running', () => {
    // The registered mock backend's recorded sync calls
    let backend: MockBackendAdapter;
    // The changes the watcher dispatched as external
    let externalChanges: FileSystemChange[];
    // Stops the watcher started by the test
    let stopWatcher: VoidFunction | undefined;

    beforeEach(async () => {
      setup();

      // Back the SQL writes made by the entry event handlers
      setupTestSqlDatabase();
      seedSqlDatabases();

      // Count file system operations and report each change made
      // through the app to the watcher, as the OS would.
      counts = registerCountingMockFileSystem(MockFs);

      // Stand in for the platform backend, recording its syncs
      backend = createMockBackendAdapter();

      // Collect the changes the watcher reports as external
      externalChanges = [];
      Events.on(Fs.events.Changed, 'test-external-changes', (change) => {
        externalChanges.push(change);
      });

      // Register the database event handlers, the file system
      // changed handler among them, as the app does.
      initializeDatabaseEventHandlers();

      // Watch the workspace as the app does
      stopWatcher = await Fs.startWatcher([
        { workspaceId: workspace_1.id, path: workspace_1.path },
      ]);
    });

    afterEach(async () => {
      stopWatcher?.();
      counts.restore();
      cleanupTestSqlDatabase();
      await cleanup();
    });

    it('does not sync after an in-app entry property edit', async () => {
      await updateEntryProperty(objectEntry1.id, 'Content', 'Edited in app');
      await flushFileSystemChangeDebounces();

      // The edit should have reached disk
      expect(counts.writes.get(entryFilePath(objectEntry1))).toBe(1);

      expect(backend.syncEntryFilesCalls).toEqual([]);
      expect(backend.backgroundSyncCalls).toEqual([]);
    });

    it.each([
      ['root', rootStorageEntry1],
      ['common', commonStorageEntry1],
      ['property', propertyStorageEntry1],
      ['entry', entryStorageEntry1],
    ])(
      'does not sync after an in-app property file write in a %s storage database',
      async (_storage, entry) => {
        const path = await writePropertyFile(
          entry.id,
          imagePropertyName,
          new File(['bytes'], 'amplification.png'),
        );
        await flushFileSystemChangeDebounces();

        // The file should have reached disk
        expect(MockFs.exists(path)).toBe(true);

        expect(backend.syncEntryFilesCalls).toEqual([]);
        expect(backend.backgroundSyncCalls).toEqual([]);
      },
    );

    it("does not sync after adding the first file to a property's own directory", async () => {
      // Add the first file to the property's directory
      const path = await writePropertyFile(
        propertyStorageEntry1.id,
        genericFilePropertyName,
        new File(['bytes'], 'amplification.pdf'),
      );

      // Report the created property directory, as the desktop adapter
      // does once it emits creations. Directory creations are not
      // recorded as self-writes.
      MockFs.dispatchWatchEvent('create', [Fs.parentDirPath(path)]);

      // Let the debounced sync run
      await flushFileSystemChangeDebounces();

      // The property's directory should be the one created
      expect(Fs.fileNameFromPath(Fs.parentDirPath(path))).toBe(
        genericFilePropertyName,
      );

      expect(backend.syncEntryFilesCalls).toEqual([]);
      expect(backend.backgroundSyncCalls).toEqual([]);
    });

    it('syncs only the externally edited entry, without scanning the workspace', async () => {
      // Edit an entry file outside of the app
      appendToEntryFile(objectEntry1);
      MockFs.dispatchWatchEvent('modify', [entryFilePath(objectEntry1)]);
      await flushFileSystemChangeDebounces();

      expect(backend.syncEntryFilesCalls).toEqual([
        [createEntryFileChange(objectDatabase.id, objectEntry1.path)],
      ]);
      expect(backend.backgroundSyncCalls).toEqual([]);
    });

    it('does not sync after creating an entry in the app', async () => {
      const entry = await createEntry(objectDatabase.id, 'Created in app');
      await flushFileSystemChangeDebounces();

      // The entry file should have reached disk
      expect(MockFs.exists(entryFilePath(entry))).toBe(true);

      expect(backend.syncEntryFilesCalls).toEqual([]);
      expect(backend.backgroundSyncCalls).toEqual([]);
    });

    // Pins Issue 70 at the watcher: Directory operations made in the app
    // are not recorded as self-writes. The watcher dispatches them as
    // external changes. Remove .fails once fixed.
    it.fails(
      'records creating an entry in the app as a watcher self-write, dispatching no external change',
      async () => {
        await createEntry(objectDatabase.id, 'Created in app');
        await flushFileSystemChangeDebounces();

        expect(externalChanges).toEqual([]);
      },
    );

    it.each([
      ['object', objectEntry1],
      ['entry', entryStorageEntry1],
    ])(
      'renames an entry file in a %s storage database in the app while watching',
      async (_storage, entry) => {
        const renamedEntry = await renameEntry(entry.id, 'Renamed in app');
        await flushFileSystemChangeDebounces();

        expect(MockFs.exists(entryFilePath(renamedEntry))).toBe(true);
        expect(MockFs.exists(entryFilePath(entry))).toBe(false);
      },
    );

    it('deletes an entry file in the app while watching', async () => {
      await deleteEntry(objectEntry1.id);
      await flushFileSystemChangeDebounces();

      expect(MockFs.existsInTrash(entryFilePath(objectEntry1))).toBe(true);
    });

    // Pins Issue 70: Directory operations made in the app are not
    // recorded as self-writes. Remove .fails once fixed.
    it.fails('does not sync after renaming an entry in the app', async () => {
      await renameEntry(objectEntry1.id, 'Renamed in app');
      await flushFileSystemChangeDebounces();

      expect(backend.syncEntryFilesCalls).toEqual([]);
      expect(backend.backgroundSyncCalls).toEqual([]);
    });

    // Pins Issue 70 at the watcher: Directory operations made in the app
    // are not recorded as self-writes. The watcher dispatches them as
    // external changes. Remove .fails once fixed.
    it.fails(
      'records renaming an entry in the app as a watcher self-write, dispatching no external change',
      async () => {
        await renameEntry(objectEntry1.id, 'Renamed in app');
        await flushFileSystemChangeDebounces();

        expect(externalChanges).toEqual([]);
      },
    );

    // Pins Issue 70: Directory operations made in the app are not
    // recorded as self-writes. Remove .fails once fixed.
    it.fails('does not sync after deleting an entry in the app', async () => {
      await deleteEntry(objectEntry1.id);
      await flushFileSystemChangeDebounces();

      expect(backend.syncEntryFilesCalls).toEqual([]);
      expect(backend.backgroundSyncCalls).toEqual([]);
    });

    // Pins Issue 70 at the watcher: Directory operations made in the app
    // are not recorded as self-writes. The watcher dispatches them as
    // external changes. Remove .fails once fixed.
    it.fails(
      'records deleting an entry in the app as a watcher self-write, dispatching no external change',
      async () => {
        await deleteEntry(objectEntry1.id);
        await flushFileSystemChangeDebounces();

        expect(externalChanges).toEqual([]);
      },
    );

    it('does not scan the workspace after renaming an entry in an entry storage database', async () => {
      await renameEntry(entryStorageEntry1.id, 'Renamed in app');
      await flushFileSystemChangeDebounces();

      expect(backend.backgroundSyncCalls).toEqual([]);
    });

    it('does not sync after deleting an entry in an entry storage database', async () => {
      await deleteEntry(entryStorageEntry1.id);
      await flushFileSystemChangeDebounces();

      expect(backend.syncEntryFilesCalls).toEqual([]);
      expect(backend.backgroundSyncCalls).toEqual([]);
    });

    // Pins Issue 70: Directory operations made in the app are not
    // recorded as self-writes. Remove .fails once fixed.
    it.fails(
      'does not sync after renaming an entry in an entry storage database',
      async () => {
        await renameEntry(entryStorageEntry1.id, 'Renamed in app');
        await flushFileSystemChangeDebounces();

        expect(backend.syncEntryFilesCalls).toEqual([]);
      },
    );
  });

  describe('syncEntryFiles', () => {
    beforeEach(() => {
      setup();

      // Open a recording in-memory SQL database
      setupRecordingTestSqlDatabase();
      seedSqlDatabases();

      // Index the fixture entries at the contents on disk. Nothing then
      // appears changed until a file is edited.
      indexAtCurrentContents();

      // Count file system operations
      counts = registerCountingMockFileSystem(MockFs);
    });

    afterEach(async () => {
      counts.restore();
      cleanupRecordingTestSqlDatabase();
      await cleanup();
    });

    it("indexes an externally edited entry's change", async () => {
      appendToEntryFile(objectEntry1);

      const changeset = await syncEntryFiles(
        workspace_1.id,
        parentDir,
        databases,
        [createEntryFileChange(objectDatabase.id, objectEntry1.path)],
      );

      expect(changeset.upsertedEntries.map((record) => record.id)).toEqual([
        objectEntry1.id,
      ]);
    });

    // Pins Issue 76: The targeted sync reads a changed entry's file twice.
    // Remove .fails once fixed.
    it.fails(
      "reads the changed entry's file once and no other entry file",
      async () => {
        appendToEntryFile(objectEntry1);

        await syncEntryFiles(workspace_1.id, parentDir, databases, [
          createEntryFileChange(objectDatabase.id, objectEntry1.path),
        ]);

        // Count the reads of every fixture entry's file
        const entryFileReads = entries
          .map((entry) => entryFilePath(entry))
          .filter((path) => counts.textReads.has(path))
          .map((path) => [path, counts.textReads.get(path)]);

        expect(entryFileReads).toEqual([[entryFilePath(objectEntry1), 1]]);
      },
    );

    it('lists no directory', async () => {
      appendToEntryFile(objectEntry1);

      await syncEntryFiles(workspace_1.id, parentDir, databases, [
        createEntryFileChange(objectDatabase.id, objectEntry1.path),
      ]);

      expect([...counts.dirReads.keys()]).toEqual([]);
    });
  });

  describe('syncDatabaseConfigs', () => {
    beforeEach(() => {
      setup();

      // Open a recording in-memory SQL database
      setupRecordingTestSqlDatabase();
      seedSqlDatabases();

      // Index the fixture entries at the contents on disk. Nothing then
      // appears changed until a file is edited.
      indexAtCurrentContents();

      // Count file system operations
      counts = registerCountingMockFileSystem(MockFs);
    });

    afterEach(async () => {
      counts.restore();
      cleanupRecordingTestSqlDatabase();
      await cleanup();
    });

    it("reads no entry file and lists no workspace directory for an external edit to a database's icon", async () => {
      // Edit the database's icon outside of the app
      const config = databaseConfigFile({
        ...objectDatabase,
        icon: 'lucide:book:red',
      });

      MockFs.writeTextFile(config.path, config.textContent ?? '');

      await syncDatabaseConfigs(workspace_1.id, parentDir, databases, [
        objectDatabase.id,
      ]);

      // No entry file should have been read
      expect(
        entries.filter((entry) => counts.textReads.has(entryFilePath(entry))),
      ).toEqual([]);
      // No directory should have been listed
      expect([...counts.dirReads.keys()]).toEqual([]);
    });
  });
});
