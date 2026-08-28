import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { PathConflictError } from '@minddrop/file-system';
import { PropertySchema } from '@minddrop/properties';
import { DatabaseDefaultsStore } from '../DatabaseDefaultsStore';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseCreatedEvent } from '../events';
import { setDatabaseDefault } from '../setDatabaseDefault';
import { MockFs, cleanup, parentDir, setup } from '../test-utils';
import { fetchWebpageMetadataAutomation } from '../test-utils/fixtures/database-automations.fixtures';
import { Database, DatabaseId } from '../types';
import { databaseConfigFilePath } from '../utils';
import { CreateDatabaseOptions, createDatabase } from './createDatabase';

const options: Omit<CreateDatabaseOptions, 'automations'> = {
  name: 'Tests',
  entryName: 'Test',
  description: 'A test database for unit testing',
  icon: 'test-icon',
};

const newDatabase: Database = {
  ...options,
  id: expect.any(String) as unknown as DatabaseId,
  created: expect.any(Date),
  lastModified: expect.any(Date),
  path: `${parentDir}/${options.name}`,
  entrySerializer: 'markdown',
  propertyFileStorage: 'property',
  entryOpenMode: 'in-place',
  properties: [],
  designId: null,
  designPropertyMap: {},
  defaultLayouts: {},
};

describe('createDatabase', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the database directory already exists', async () => {
    // First, create the database directory
    MockFs.createDir(`${parentDir}/${options.name}`);

    // Then, try to create an item with the same directory path
    await expect(createDatabase(options)).rejects.toThrow(PathConflictError);
  });

  it('creates a new database with the given options', async () => {
    const database = await createDatabase(options);

    expect(database).toMatchObject(newDatabase);
  });

  it('adds provided properties', async () => {
    const customProperty: PropertySchema = {
      type: 'text',
      name: 'Custom Property',
    };

    const database = await createDatabase({
      ...options,
      properties: [customProperty],
    });

    expect(database.properties).toEqual([customProperty]);
  });

  describe('automations', () => {
    it('adds provided automations', async () => {
      const database = await createDatabase({
        ...options,
        automations: [fetchWebpageMetadataAutomation],
      });

      expect(database.automations).toEqual([
        {
          ...fetchWebpageMetadataAutomation,
          // Should add an id
          id: expect.any(String),
        },
      ]);
    });

    it('does not add automations property if there are no automations', async () => {
      const database = await createDatabase({
        ...options,
      });

      expect(database.automations).toBeUndefined();
    });
  });

  describe('defaults', () => {
    afterEach(() => {
      // Reset configured defaults to their built-in values
      DatabaseDefaultsStore.reset();
    });

    it('applies configured defaults', async () => {
      // Configure defaults for new databases
      setDatabaseDefault('entryOpenMode', 'panel');
      setDatabaseDefault('propertyFileStorage', 'entry');

      const database = await createDatabase(options);

      expect(database.entryOpenMode).toBe('panel');
      expect(database.propertyFileStorage).toBe('entry');
    });

    it('prefers explicit options over configured defaults', async () => {
      // Configure a default for new databases
      setDatabaseDefault('propertyFileStorage', 'entry');

      const database = await createDatabase({
        ...options,
        propertyFileStorage: 'common',
      });

      expect(database.propertyFileStorage).toBe('common');
    });
  });

  it('adds the config to the databases store', async () => {
    const database = await createDatabase(options);

    expect(DatabasesStore.get(database.id)).toEqual(database);
  });

  it('creates the database directory', async () => {
    await createDatabase(options);

    expect(MockFs.exists(databaseConfigFilePath(newDatabase.path))).toBe(true);
  });

  it('writes the database config to the file system', async () => {
    const configFilePath = databaseConfigFilePath(newDatabase.path);

    const { path, name, ...expectedConfig } = await createDatabase(options);

    // Config file should not contain name or path (they are derived)
    expect(MockFs.readJsonFile(configFilePath)).toEqual(expectedConfig);
  });

  it('dispatches a database created event', async () =>
    new Promise<void>((done) => {
      Events.addListener(DatabaseCreatedEvent, 'test', (payload) => {
        // Payload data should be the database config
        expect(payload.data).toMatchObject(newDatabase);
        done();
      });

      createDatabase(options);
    }));
});
