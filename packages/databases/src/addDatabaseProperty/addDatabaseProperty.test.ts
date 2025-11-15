import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PropertySchema } from '@minddrop/properties';
import { DatabasesStore } from '../DatabasesStore';
import { MockFs, cleanup, objectDatabase, setup } from '../test-utils';
import { Database } from '../types';
import { databaseConfigFilePath } from '../utils';
import { addDatabaseProperty } from './addDatabaseProperty';

const newProperty: PropertySchema = {
  name: 'New Property',
  type: 'text',
};

const updatedDatabase: Database = {
  ...objectDatabase,
  properties: [...objectDatabase.properties, newProperty],
};

describe('addDatabaseProperty', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds the property to the database', async () => {
    const result = await addDatabaseProperty(objectDatabase.name, newProperty);

    expect(result).toEqual(updatedDatabase);
  });

  it('updates the database', async () => {
    await addDatabaseProperty(objectDatabase.name, newProperty);

    expect(DatabasesStore.get(objectDatabase.name)).toEqual(updatedDatabase);
  });

  it('writes the updated config to the file system', async () => {
    await addDatabaseProperty(objectDatabase.name, newProperty);

    const result = MockFs.readJsonFile<Database>(
      databaseConfigFilePath(updatedDatabase.path),
    );

    expect(result.properties).toEqual(updatedDatabase.properties);
  });
});
