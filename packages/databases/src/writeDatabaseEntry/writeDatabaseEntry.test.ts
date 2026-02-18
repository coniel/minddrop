import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Fs } from '@minddrop/file-system';
import { Properties } from '@minddrop/properties';
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
  objectDatabase,
  objectEntry1,
  setup,
  yamlObjectEntry1,
} from '../test-utils';
import { entryCoreProperties, entryCorePropertiesFilePath } from '../utils';
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
    DatabaseEntriesStore.add({
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
    DatabasesStore.add({
      ...objectDatabase,
      id: 'missing-entry-serializer',
      entrySerializer: 'non-existent-entry-serializer',
    });
    // Add an entry with a non-existent entry serializer
    DatabaseEntriesStore.add({
      ...objectEntry1,
      database: 'missing-entry-serializer',
    });

    await expect(writeDatabaseEntry(objectEntry1.id)).rejects.toThrow(
      DatabaseEntrySerializerNotRegisteredError,
    );
  });

  it('ensures that the core properties subdirectory exists', async () => {
    const path = Fs.parentDirPath(
      entryCorePropertiesFilePath(objectEntry1.path),
    );

    // Remove the properties directory before writing to ensure it doesn't exist
    MockFs.removeFile(path);

    await writeDatabaseEntry(objectEntry1.id);

    expect(MockFs.exists(Fs.parentDirPath(path))).toBe(true);
  });

  it('writes the core properties to the properties subdirectory', async () => {
    const path = entryCorePropertiesFilePath(objectEntry1.path);

    // Remove the file before writing to ensure it doesn't exist
    MockFs.removeFile(path);

    await writeDatabaseEntry(objectEntry1.id);

    const properties = Properties.fromYaml(
      objectDatabase.properties,
      MockFs.readTextFile(path),
    );

    expect(properties).toEqual(entryCoreProperties(objectEntry1));
  });

  describe('non-file based entry', () => {
    it('writes the entry properties to the main entry file', async () => {
      // Remove the file before writing to ensure it doesn't exist
      MockFs.removeFile(yamlObjectEntry1.path);

      await writeDatabaseEntry(yamlObjectEntry1.id);

      const properties = await MockFs.readYamlFile(yamlObjectEntry1.path);

      expect(properties).toEqual(yamlObjectEntry1.properties);
    });
  });
});
