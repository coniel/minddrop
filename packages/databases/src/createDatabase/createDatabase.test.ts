import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { BaseDirectory, PathConflictError } from '@minddrop/file-system';
import { PropertySchema } from '@minddrop/properties';
import { DatabasesStore } from '../DatabasesStore';
import { DatabasesConfigFileName } from '../constants';
import { UrlDataType } from '../data-type-configs';
import { DataTypeNotFoundError, DatabaseAlreadyExistsError } from '../errors';
import { DatabaseCreatedEvent } from '../events';
import { MockFs, cleanup, parentDir, setup } from '../test-utils';
import { Database, DatabasePathsConfig, DatabasesConfig } from '../types';
import { databaseConfigFilePath } from '../utils';
import { CreateDatabaseOptions, createDatabase } from './createDatabase';

const options: CreateDatabaseOptions = {
  name: 'Tests',
  entryName: 'Test',
  dataType: UrlDataType.type,
  description: 'A test database for unit testing',
  icon: 'test-icon',
};

const newDatabase: Database = {
  ...options,
  // Should inherit properties from the base database
  properties: UrlDataType.properties,
  created: expect.any(Date),
  path: `${parentDir}/${options.name}`,
  entrySerializer: 'markdown',
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

  it('throws if the database already exists', async () => {
    // First, create the database
    await createDatabase(parentDir, options);

    // Then, try to create it again
    await expect(createDatabase(parentDir, options)).rejects.toThrow(
      DatabaseAlreadyExistsError,
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

  it('adds the config to the databases store', async () => {
    const database = await createDatabase(parentDir, options);

    expect(DatabasesStore.get(database.name)).toEqual(database);
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
    });
  });

  it('adds the database to the databases config file', async () => {
    await createDatabase(parentDir, options);

    const databasesConfig = MockFs.readJsonFile<DatabasesConfig>(
      DatabasesConfigFileName,
      {
        baseDir: BaseDirectory.AppConfig,
      },
    );

    expect(
      databasesConfig.paths.find(
        (db: DatabasePathsConfig) => db.name === newDatabase.name,
      ),
    ).toEqual({
      name: newDatabase.name,
      path: newDatabase.path,
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
