import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  CountingMockFileSystem,
  registerCountingMockFileSystem,
} from '@minddrop/file-system/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import {
  MockFs,
  cleanup,
  cleanupRecordingTestSqlDatabase,
  databaseConfigFile,
  databaseDirPath,
  databases,
  entries,
  entryFilePath,
  entryStorageDatabase,
  indexAtCurrentContents,
  objectDatabase,
  parentDir,
  resolveRecordedDeletedEntryIds,
  resolveUpsertedEntryPaths,
  seedSqlDatabases,
  setup,
  setupRecordingTestSqlDatabase,
  snapshotIndex,
  withoutDatabaseProperty,
} from '../../test-utils';
import { Database } from '../../types';
import { sqlDeleteDatabase } from '../sqlDeleteDatabase';
import { sqlGetAllDatabases } from '../sqlGetAllDatabases';
import { syncDatabaseConfigs } from './syncDatabaseConfigs';

const { workspace_1 } = WorkspaceFixtures;

// The object database's config file path
const configPath = databaseConfigFile(objectDatabase).path;

describe('syncDatabaseConfigs', () => {
  // The counted file system operations
  let counts: CountingMockFileSystem;

  beforeEach(() => {
    setup();

    // Open a recording in-memory SQL database
    setupRecordingTestSqlDatabase();

    // Seed each fixture database's SQL record
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

  it('upserts a database whose icon changed', async () => {
    const edited = { ...objectDatabase, icon: 'lucide:book:red' };

    writeConfig(edited);

    const changeset = await sync();

    expect(changeset.hasChanges).toBe(true);
    expect(changeset.upsertedDatabases).toEqual([edited]);
    expect(indexedIcon(objectDatabase.id)).toBe(edited.icon);
  });

  it('re-reads no entry file when the schema is unchanged', async () => {
    writeConfig({ ...objectDatabase, icon: 'lucide:book:red' });

    await sync();

    // No entry file should have been read or upserted
    expect(
      entries.filter((entry) => counts.textReads.has(entryFilePath(entry))),
    ).toEqual([]);
    databases.forEach((database) => {
      expect(resolveUpsertedEntryPaths(database.id)).toEqual([]);
    });
  });

  it("re-indexes a database's entries under their existing IDs when its schema changed", async () => {
    writeConfig(withoutDatabaseProperty(objectDatabase, 'Icon'));

    const changeset = await sync();

    // The database's entries
    const objectEntries = entries.filter(
      (entry) => entry.database === objectDatabase.id,
    );

    expect(changeset.upsertedEntries.map((record) => record.id).sort()).toEqual(
      objectEntries.map((entry) => entry.id).sort(),
    );

    // No other database's entries should be re-indexed
    databases.forEach((database) => {
      expect(resolveUpsertedEntryPaths(database.id).sort()).toEqual(
        database.id === objectDatabase.id
          ? objectEntries.map((entry) => entry.path).sort()
          : [],
      );
    });
  });

  it('leaves the index alone when a config cannot be parsed', async () => {
    // Snapshot the index before the sync
    const before = snapshotIndex();

    MockFs.writeTextFile(configPath, '{ not json');

    const changeset = await sync();

    expect(changeset.hasChanges).toBe(false);
    expect(snapshotIndex()).toEqual(before);
    expect(resolveRecordedDeletedEntryIds()).toEqual([]);
    expect(indexedIcon(objectDatabase.id)).toBe(objectDatabase.icon);
    expect(scannedWorkspace()).toBe(false);
  });

  it('scans the workspace when a config is gone', async () => {
    MockFs.removeFile(configPath);

    const changeset = await sync();

    expect(scannedWorkspace()).toBe(true);
    expect(changeset.deletedDatabaseIds).toEqual([objectDatabase.id]);
  });

  it('scans the workspace when a config claims another ID', async () => {
    writeConfig({ ...objectDatabase, id: 'database_moved' });

    const changeset = await sync();

    // The scan should index the database under its new ID
    expect(changeset.deletedDatabaseIds).toEqual([objectDatabase.id]);
    expect(snapshotIndex()[objectDatabase.path]).toBe('database_moved');
  });

  it('scans the workspace when a config changes its entry serializer', async () => {
    writeConfig({ ...objectDatabase, entrySerializer: 'yaml' });

    await sync();

    // The scan should drop the markdown entries the database no
    // longer reads.
    expect(indexedEntryPaths(objectDatabase)).toEqual([]);
  });

  it('scans the workspace when a config changes its property file storage', async () => {
    // Add a file which is an entry file only when each entry has its
    // own directory.
    MockFs.addFiles([`${databaseDirPath(objectDatabase)}/Nested/Nested.md`]);

    writeConfig({ ...objectDatabase, propertyFileStorage: 'entry' });

    await sync();

    // The scan should index the entry in its own directory
    expect(indexedEntryPaths(objectDatabase)).toContain(
      `${objectDatabase.path}/Nested/Nested.md`,
    );
  });

  it('reads every config before writing any, leaving the index for a scan to diff', async () => {
    // The edited database, synced alongside one needing a scan
    const edited = { ...objectDatabase, icon: 'lucide:book:red' };

    writeConfig(edited);
    writeConfig({ ...entryStorageDatabase, id: 'database_moved' });

    const changeset = await syncDatabaseConfigs(
      workspace_1.id,
      parentDir,
      databases,
      [objectDatabase.id, entryStorageDatabase.id],
    );

    // The scan should find the edit, which the sync has not indexed
    expect(changeset.upsertedDatabases).toContainEqual(edited);
  });

  it('syncs a database listed twice once', async () => {
    const edited = { ...objectDatabase, icon: 'lucide:book:red' };

    writeConfig(edited);

    const changeset = await syncDatabaseConfigs(
      workspace_1.id,
      parentDir,
      databases,
      [objectDatabase.id, objectDatabase.id],
    );

    expect(changeset.upsertedDatabases).toEqual([edited]);
  });

  it('syncs a valid config beside one which cannot be parsed', async () => {
    const edited = { ...entryStorageDatabase, icon: 'lucide:book:red' };

    MockFs.writeTextFile(configPath, '{ not json');
    writeConfig(edited);

    const changeset = await syncDatabaseConfigs(
      workspace_1.id,
      parentDir,
      databases,
      [objectDatabase.id, entryStorageDatabase.id],
    );

    expect(changeset.upsertedDatabases).toEqual([edited]);
    expect(indexedIcon(entryStorageDatabase.id)).toBe(edited.icon);
    expect(indexedIcon(objectDatabase.id)).toBe(objectDatabase.icon);
  });

  it('scans the workspace when the database is not loaded', async () => {
    writeConfig({ ...objectDatabase, icon: 'lucide:book:red' });

    await syncDatabaseConfigs(
      workspace_1.id,
      parentDir,
      databases.filter((database) => database.id !== objectDatabase.id),
      [objectDatabase.id],
    );

    expect(scannedWorkspace()).toBe(true);
  });

  it('scans the workspace when the database is not indexed', async () => {
    writeConfig({ ...objectDatabase, icon: 'lucide:book:red' });
    sqlDeleteDatabase(objectDatabase.id, { silent: true });

    await sync();

    expect(scannedWorkspace()).toBe(true);
  });

  it('does not scan the workspace for a config change it can sync', async () => {
    writeConfig({ ...objectDatabase, icon: 'lucide:book:red' });

    await sync();

    expect(scannedWorkspace()).toBe(false);
  });

  /**
   * Checks whether the workspace was listed, as a scan does. Used
   * where no outcome tells a scan from a targeted sync.
   *
   * @returns Whether the workspace directory was listed.
   */
  function scannedWorkspace(): boolean {
    return counts.dirReads.has(parentDir);
  }
});

/**
 * Writes a database's config file, as an edit outside the app does.
 *
 * @param database - The database to write the config of.
 */
function writeConfig(database: Database): void {
  // Serialize the database into its config file
  const file = databaseConfigFile(database);

  // Write the config file
  MockFs.writeTextFile(file.path, file.textContent ?? '');
}

/**
 * Returns a database's indexed icon.
 *
 * @param databaseId - The ID of the database.
 * @returns The icon on the database's SQL record.
 */
function indexedIcon(databaseId: string): string | undefined {
  return sqlGetAllDatabases().find((record) => record.id === databaseId)?.icon;
}

/**
 * Returns the paths of a database's indexed entries.
 *
 * @param database - The database whose indexed entries to return.
 * @returns The entries' paths, keyed as in the index snapshot.
 */
function indexedEntryPaths(database: Database): string[] {
  return Object.keys(snapshotIndex()).filter((path) =>
    path.startsWith(`${database.path}/`),
  );
}

/**
 * Syncs the object database's config in the fixture workspace.
 *
 * @returns The sync's result.
 */
function sync() {
  return syncDatabaseConfigs(workspace_1.id, parentDir, databases, [
    objectDatabase.id,
  ]);
}
