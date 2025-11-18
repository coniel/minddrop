import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Markdown } from '@minddrop/markdown';
import { Properties } from '@minddrop/properties';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import { DatabasesStore } from '../DatabasesStore';
import {
  DataTypeNotFoundError,
  DatabaseEntryNotFoundError,
  DatabaseEntrySerializerNotRegisteredError,
  DatabaseNotFoundError,
} from '../errors';
import {
  MockFs,
  cleanup,
  dataTypeSerializerEntry1,
  objectDatabase,
  objectEntry1,
  pdfDatabase,
  pdfEntry1,
  setup,
  yamlObjectEntry1,
} from '../test-utils';
import {
  entryCoreProperties,
  entryCorePropertiesFilePath,
  fileEntryPropertiesFilePath,
} from '../utils';
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

    await expect(writeDatabaseEntry(objectEntry1.path)).rejects.toThrow(
      DatabaseNotFoundError,
    );
  });

  it('throws if the data type is not registered', async () => {
    DatabaseEntriesStore.clear();
    // Add a database with a non-existent data type
    DatabasesStore.add({
      ...objectDatabase,
      id: 'missing-data-type',
      dataType: 'non-existent-data-type',
    });
    // Add an entry with a non-existent data type
    DatabaseEntriesStore.add({
      ...objectEntry1,
      database: 'missing-data-type',
    });

    await expect(writeDatabaseEntry(objectEntry1.path)).rejects.toThrow(
      DataTypeNotFoundError,
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

    await expect(writeDatabaseEntry(objectEntry1.path)).rejects.toThrow(
      DatabaseEntrySerializerNotRegisteredError,
    );
  });

  it('writes the core properties to the properties subdirectory', async () => {
    const path = entryCorePropertiesFilePath(objectEntry1.path);

    // Remove the file before writing to ensure it doesn't exist
    MockFs.removeFile(path);

    await writeDatabaseEntry(objectEntry1.path);

    const properties = Properties.fromYaml(
      objectDatabase.properties,
      MockFs.readTextFile(path),
    );

    expect(properties).toEqual(entryCoreProperties(objectEntry1));
  });

  describe('file based entry', () => {
    it('writes the entry properties to the properties subdirectory', async () => {
      const path = fileEntryPropertiesFilePath(pdfEntry1.path, 'md');

      // Remove the file before writing to ensure it doesn't exist
      MockFs.removeFile(path);

      await writeDatabaseEntry(pdfEntry1.path);

      const properties = Markdown.getProperties(
        pdfDatabase.properties,
        MockFs.readTextFile(path),
      );

      expect(properties).toEqual(pdfEntry1.properties);
    });
  });

  describe('non-file based entry', () => {
    it('writes the entry properties to the main entry file', async () => {
      // Remove the file before writing to ensure it doesn't exist
      MockFs.removeFile(yamlObjectEntry1.path);

      await writeDatabaseEntry(yamlObjectEntry1.path);

      const properties = await MockFs.readYamlFile(yamlObjectEntry1.path);

      expect(properties).toEqual(yamlObjectEntry1.properties);
    });
  });

  describe('dtata type serializer', () => {
    it('writes the entry properties to the main entry file', async () => {
      // Remove the file before writing to ensure it doesn't exist
      MockFs.removeFile(dataTypeSerializerEntry1.path);

      await writeDatabaseEntry(dataTypeSerializerEntry1.path);

      const entry = MockFs.readJsonFile(dataTypeSerializerEntry1.path);

      expect(entry).toEqual({
        properties: dataTypeSerializerEntry1.properties,
        data: dataTypeSerializerEntry1.data,
      });
    });
  });
});
