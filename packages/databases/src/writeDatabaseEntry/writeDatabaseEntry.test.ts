import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabasesStore } from '../DatabasesStore';
import {
  DatabaseEntryNotFoundError,
  DatabaseEntrySerializerNotRegisteredError,
  DatabaseNotFoundError,
} from '../errors';
import {
  MockFs,
  cleanup,
  entryStorageEntry1,
  objectDatabase,
  objectEntry1,
  setup,
  yamlObjectEntry1,
} from '../test-utils';
import { writeDatabaseEntry } from './writeDatabaseEntry';

describe('writeDatabaseEntry', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the entry does not exist', async () => {
    await expect(writeDatabaseEntry('non-existent-entry')).rejects.toThrow(
      DatabaseEntryNotFoundError,
    );
  });

  it('throws if the entry database does not exist', async () => {
    DatabaseEntriesStore.clear();
    // Add an entry with a non-existent database
    DatabaseEntriesStore.set({
      ...objectEntry1,
      database: 'non-existent-db',
    });

    await expect(writeDatabaseEntry(objectEntry1.id)).rejects.toThrow(
      DatabaseNotFoundError,
    );
  });

  it('throws if the entry serializer is not registered', async () => {
    DatabaseEntriesStore.clear();
    // Add a database with a non-existent entry serializer
    DatabasesStore.set({
      ...objectDatabase,
      id: 'missing-entry-serializer',
      entrySerializer: 'non-existent-entry-serializer',
    });
    // Add an entry with a non-existent entry serializer
    DatabaseEntriesStore.set({
      ...objectEntry1,
      database: 'missing-entry-serializer',
    });

    await expect(writeDatabaseEntry(objectEntry1.id)).rejects.toThrow(
      DatabaseEntrySerializerNotRegisteredError,
    );
  });

  it('ensures the entry subdirectory exists if the database uses entry based storage', async () => {
    const path = entryStorageEntry1.path;
    const parentDir = path.substring(0, path.lastIndexOf('/'));

    // Remove the entry subdirectory before writing to ensure it doesn't exist
    MockFs.removeFile(parentDir);

    await writeDatabaseEntry(entryStorageEntry1.id);

    expect(MockFs.exists(parentDir)).toBe(true);
  });

  it('writes the user properties to the entry file', async () => {
    // Remove the file before writing to ensure it doesn't exist
    MockFs.removeFile(yamlObjectEntry1.path);

    await writeDatabaseEntry(yamlObjectEntry1.id);

    const properties = await MockFs.readYamlFile(yamlObjectEntry1.path);

    expect(properties).toEqual(yamlObjectEntry1.properties);
  });
});
