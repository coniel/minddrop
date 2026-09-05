import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AppErrorEvent, AppErrorEventData, Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { Paths } from '@minddrop/utils';
import { DatabaseEntrySerializersStore } from '../DatabaseEntrySerializersStore';
import { EntryConversionBackupDirName } from '../constants';
import { jsonEntrySerializer } from '../entry-serializers';
import { DatabaseEntrySerializerNotRegisteredError } from '../errors';
import { onUpdateDatabase } from '../event-handlers';
import { DatabaseUpdatedEvent } from '../events';
import { getDatabase } from '../getDatabase';
import { getDatabaseEntry } from '../getDatabaseEntry';
import { sqlGetEntrySyncRecords, sqlUpsertDatabase } from '../sql';
import {
  MockFs,
  cleanup,
  cleanupRecordingTestSqlDatabase,
  clearRecordedSqlStatements,
  collectionDatabase,
  collectionEntry1,
  getRecordedSqlStatements,
  objectDatabase,
  objectEntry1,
  referenceEntry1,
  rootStorageDatabase,
  rootStorageEntry1,
  rootStorageEntry1FileContents,
  setup,
  setupRecordingTestSqlDatabase,
} from '../test-utils';
import { Database } from '../types';
import { databaseConfigFilePath } from '../utils';
import { setDatabaseEntrySerializer } from './setDatabaseEntrySerializer';

describe('setDatabaseEntrySerializer', () => {
  beforeEach(() => {
    setup();

    // Open a recording in-memory SQL database
    setupRecordingTestSqlDatabase();

    // Seed the database records the converted entries belong to
    [objectDatabase, collectionDatabase, rootStorageDatabase].forEach(
      (database) => {
        sqlUpsertDatabase(
          {
            id: database.id,
            name: database.name,
            path: database.path,
            icon: database.icon,
          },
          { silent: true },
        );
      },
    );

    // Drop the seeding statements so tests only see the conversion's SQL
    clearRecordedSqlStatements();

    // Register the SQL sync listener normally wired by
    // initializeDatabaseEventHandlers
    Events.on(DatabaseUpdatedEvent, 'test:sql-sync', (data) => {
      onUpdateDatabase(data);
    });
  });

  afterEach(async () => {
    cleanupRecordingTestSqlDatabase();
    await cleanup();
  });

  it('does nothing when the serializer is unchanged', async () => {
    const result = await setDatabaseEntrySerializer(
      objectDatabase.id,
      'markdown',
    );

    // The serializer is unchanged and the entry file stays in place
    expect(result.entrySerializer).toBe('markdown');
    expect(await Fs.exists(objectEntry1.path)).toBe(true);
  });

  it('throws when the serializer is not registered', async () => {
    await expect(
      setDatabaseEntrySerializer(objectDatabase.id, 'missing'),
    ).rejects.toThrow(DatabaseEntrySerializerNotRegisteredError);

    // The entry file is left untouched
    expect(await Fs.exists(objectEntry1.path)).toBe(true);
  });

  it('converts entry files to the new format', async () => {
    await setDatabaseEntrySerializer(objectDatabase.id, 'json');

    const newPath = `${Fs.removeExtension(objectEntry1.path)}.json`;

    // The old entry file is removed
    expect(await Fs.exists(objectEntry1.path)).toBe(false);

    // The new entry file contains the JSON serialized properties
    expect(MockFs.readTextFile(newPath)).toBe(
      jsonEntrySerializer.serialize(
        objectDatabase.properties,
        objectEntry1.properties,
      ),
    );

    // The entry's stored path points to the new file
    expect(getDatabaseEntry(objectEntry1.id).path).toBe(newPath);

    // The entry's SQL record carries the new path
    expect(sqlGetEntrySyncRecords(objectDatabase.id)).toContainEqual(
      expect.objectContaining({
        id: objectEntry1.id,
        path: newPath,
      }),
    );
  });

  it('moves the original entry files to the trash', async () => {
    await setDatabaseEntrySerializer(objectDatabase.id, 'json');

    // The backup directory holding the originals is moved to the trash
    const trashedBackup = MockFs.getTrash().some((item) =>
      item.path.endsWith(EntryConversionBackupDirName),
    );
    expect(trashedBackup).toBe(true);
  });

  it('serializes collection properties as durable addresses', async () => {
    await setDatabaseEntrySerializer(collectionDatabase.id, 'yaml');

    const newPath = `${Fs.removeExtension(collectionEntry1.path)}.yaml`;

    // Collection members are written as durable addresses
    expect(MockFs.readTextFile(newPath)).toContain(
      'Collection Database/Related Entry 1',
    );
  });

  it('leaves references to the converted entries untouched', async () => {
    const before = MockFs.readTextFile(collectionEntry1.path);

    // Convert the database containing the referenced entry
    await setDatabaseEntrySerializer(rootStorageDatabase.id, 'yaml');

    // Addresses name entries by title, so the converted entries keep
    // theirs and the referencing file needs no rewrite
    expect(MockFs.readTextFile(collectionEntry1.path)).toBe(before);
  });

  it('dispatches an update event and persists the config', async () => {
    let dispatchedSerializer: string | undefined;

    Events.addListener(DatabaseUpdatedEvent, 'test', (payload) => {
      dispatchedSerializer = payload.updated.entrySerializer;
    });

    await setDatabaseEntrySerializer(objectDatabase.id, 'json');

    // The event carries the new serializer
    expect(dispatchedSerializer).toBe('json');

    // The persisted config reflects the new serializer
    const config = MockFs.readJsonFile<Database>(
      databaseConfigFilePath(objectDatabase.path),
    );
    expect(config.entrySerializer).toBe('json');
  });

  it('restores the original state when the conversion fails', async () => {
    registerFailingSerializer();

    const result = await setDatabaseEntrySerializer(
      rootStorageDatabase.id,
      'failing',
    );

    // The original entry files are restored with their original content
    expect(MockFs.readTextFile(rootStorageEntry1.path)).toBe(
      rootStorageEntry1FileContents,
    );
    expect(await Fs.exists(referenceEntry1.path)).toBe(true);

    // The partially written new format files are removed
    expect(
      await Fs.exists(`${Fs.removeExtension(rootStorageEntry1.path)}.fail`),
    ).toBe(false);

    // The entries' stored paths are unchanged
    expect(getDatabaseEntry(rootStorageEntry1.id).path).toBe(
      rootStorageEntry1.path,
    );

    // The backup directory is removed
    const backupDir = Fs.concatPath(
      rootStorageDatabase.path,
      Paths.hiddenDirName,
      `${rootStorageDatabase.name} ${EntryConversionBackupDirName}`,
    );
    expect(await Fs.exists(backupDir)).toBe(false);

    // The config retains the original serializer
    expect(result.entrySerializer).toBe('markdown');
    expect(getDatabase(rootStorageDatabase.id).entrySerializer).toBe(
      'markdown',
    );

    // No entry upsert statements should have been executed, as the
    // address change event is never dispatched on failure
    const entryUpserts = getRecordedSqlStatements().filter((statement) =>
      statement.sql.includes('INSERT OR REPLACE INTO entries'),
    );

    expect(entryUpserts).toEqual([]);
  });

  it('dispatches an app error event when the conversion fails', async () => {
    registerFailingSerializer();

    let dispatchedError: AppErrorEventData | undefined;

    Events.addListener(AppErrorEvent, 'test', (payload) => {
      dispatchedError = payload;
    });

    await setDatabaseEntrySerializer(rootStorageDatabase.id, 'failing');

    // The event carries the underlying error
    expect(dispatchedError?.error).toBeInstanceOf(Error);
    expect(dispatchedError?.message).toBe(
      'databases.settings.entrySerializer.error.message',
    );
  });
});

// Registers a serializer whose serialize call fails after the first
// entry, leaving a partial conversion to roll back
function registerFailingSerializer(): void {
  let calls = 0;

  DatabaseEntrySerializersStore.load([
    {
      id: 'failing',
      name: 'test',
      description: 'test',
      fileExtension: 'fail',
      serialize: () => {
        calls += 1;

        // Fail on the second entry
        if (calls > 1) {
          throw new Error('Serialization failed');
        }

        return 'serialized';
      },
      deserialize: () => ({}),
    },
  ]);
}
