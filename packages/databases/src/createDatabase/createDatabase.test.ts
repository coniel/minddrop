import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { BaseDirectory, PathConflictError } from '@minddrop/file-system';
import { PropertySchema } from '@minddrop/properties';
import { omitPath } from '@minddrop/utils';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseCreatedEvent } from '../events';
import { MockFs, cleanup, parentDir, setup } from '../test-utils';
import { fetchWebpageMetadataAutomation } from '../test-utils/fixtures/database-automations.fixtures';
import { Database, DatabasePathsConfig, DatabasesConfig } from '../types';
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
  id: expect.any(String),
  created: expect.any(Date),
  lastModified: expect.any(Date),
  path: `${parentDir}/${options.name}`,
  entrySerializer: 'markdown',
  propertyFileStorage: 'property',
  properties: [],
  defaultDesigns: {},
  designPropertyMaps: {},
};

describe('createDatabase', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the database directory already exists', async () => {
    // First, create the database directory
    MockFs.createDir(`${parentDir}/${options.name}`);

    // Then, try to create an item with the same directory path
    await expect(createDatabase(parentDir, options)).rejects.toThrow(
      PathConflictError,
    );
  });

  it('creates a new database with the given options', async () => {
    const database = await createDatabase(parentDir, options);

    expect(database).toMatchObject(newDatabase);
  });

  it('adds provided properties', async () => {
    const customProperty: PropertySchema = {
      type: 'text',
      name: 'Custom Property',
    };

    const database = await createDatabase(parentDir, {
      ...options,
      properties: [customProperty],
    });

    expect(database.properties).toEqual([customProperty]);
  });

  describe('automations', () => {
    it('adds provided automations', async () => {
      const database = await createDatabase(parentDir, {
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
      const database = await createDatabase(parentDir, {
        ...options,
      });

      expect(database.automations).toBeUndefined();
    });
  });

  it('adds the config to the databases store', async () => {
    const database = await createDatabase(parentDir, options);

    expect(DatabasesStore.get(database.id)).toEqual(database);
  });

  it('creates the database directory', async () => {
    await createDatabase(parentDir, options);

    expect(MockFs.exists(databaseConfigFilePath(newDatabase.path))).toBe(true);
  });

  it('writes the database config to the file system', async () => {
    const configFilePath = databaseConfigFilePath(newDatabase.path);

    const database = await createDatabase(parentDir, options);

    expect(MockFs.readJsonFile(configFilePath)).toEqual(omitPath(database));
  });

  it('dispatches a database created event', async () =>
    new Promise<void>((done) => {
      Events.addListener(DatabaseCreatedEvent, 'test', (payload) => {
        // Payload data should be the database config
        expect(payload.data).toMatchObject(newDatabase);
        done();
      });

      createDatabase(parentDir, options);
    }));
});
