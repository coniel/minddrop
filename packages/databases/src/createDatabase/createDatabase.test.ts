import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { BaseDirectory, PathConflictError } from '@minddrop/file-system';
import { PropertySchema } from '@minddrop/properties';
import { DatabasesStore } from '../DatabasesStore';
import { DatabasesConfigFileName } from '../constants';
import { ObjectDataType, UrlDataType } from '../data-type-configs';
import { DataTypeNotFoundError } from '../errors';
import { DatabaseCreatedEvent } from '../events';
import { MockFs, cleanup, parentDir, setup } from '../test-utils';
import { Database, DatabasePathsConfig, DatabasesConfig } from '../types';
import { databaseConfigFilePath } from '../utils';
import { CreateDatabaseOptions, createDatabase } from './createDatabase';

const options: Omit<CreateDatabaseOptions, 'automations'> = {
  name: 'Tests',
  entryName: 'Test',
  dataType: UrlDataType.type,
  description: 'A test database for unit testing',
  icon: 'test-icon',
};

const newDatabase: Database = {
  ...options,
  id: expect.any(String),
  // Should inherit properties from the base database
  properties: UrlDataType.properties,
  created: expect.any(Date),
  lastModified: expect.any(Date),
  path: `${parentDir}/${options.name}`,
  entrySerializer: 'markdown',
  automations: [
    {
      ...UrlDataType.automations![0],
      id: expect.any(String),
    },
  ],
};

describe('createDatabase', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the data type does not exist', async () => {
    const invalidOptions = {
      ...options,
      dataType: 'non-existent-base-type',
    };

    await expect(createDatabase(parentDir, invalidOptions)).rejects.toThrow(
      DataTypeNotFoundError,
    );
  });

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

  it('uses provided properties in place of default data type ones', async () => {
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
    it('adds data type automations', () => {
      expect(newDatabase.automations).toEqual([
        {
          ...UrlDataType.automations![0],
          // Should add an id
          id: expect.any(String),
        },
      ]);
    });

    it('adds provided automations', async () => {
      const database = await createDatabase(parentDir, {
        ...options,
        dataType: ObjectDataType.type,
        automations: [UrlDataType.automations![0]],
      });

      expect(database.automations).toEqual([
        {
          ...UrlDataType.automations![0],
          // Should add an id
          id: expect.any(String),
        },
      ]);
    });

    it('does not add automations property if there are no automations', async () => {
      const database = await createDatabase(parentDir, {
        ...options,
        dataType: ObjectDataType.type,
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

    // Path is not stored in the config file
    // @ts-expect-error
    delete database.path;

    expect(MockFs.readJsonFile(configFilePath)).toEqual({
      ...database,
      created: database.created.toISOString(),
      lastModified: database.lastModified.toISOString(),
    });
  });

  it('adds the database to the databases config file', async () => {
    const database = await createDatabase(parentDir, options);

    const databasesConfig = MockFs.readJsonFile<DatabasesConfig>(
      DatabasesConfigFileName,
      {
        baseDir: BaseDirectory.AppConfig,
      },
    );

    expect(
      databasesConfig.paths.find(
        (db: DatabasePathsConfig) => db.id === database.id,
      ),
    ).toEqual({
      id: database.id,
      path: database.path,
    });
  });

  it('dispatches a database created event', async () =>
    new Promise<void>((done) => {
      Events.addListener(DatabaseCreatedEvent, 'test', (payload) => {
        // Payload data should be the database config
        expect(payload.data).toEqual(newDatabase);
        done();
      });

      createDatabase(parentDir, options);
    }));
});
