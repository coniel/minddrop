import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabasesStore } from '../DatabasesStore';
import { MockFs, cleanup, objectDatabase, setup } from '../test-utils';
import { Database } from '../types';
import { databaseConfigFilePath } from '../utils';
import { removeDatabaseProperty } from './removeDatabaseProperty';

const propertyNameToRemove = objectDatabase.properties[0].name;

const updatedDatabase = {
  ...objectDatabase,
  properties: objectDatabase.properties.slice(1),
};

describe('removeDatabaseProperty', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the property from the item type', async () => {
    const result = await removeDatabaseProperty(
      objectDatabase.name,
      propertyNameToRemove,
    );

    expect(result).toEqual(updatedDatabase);
  });

  it('updates the item type', async () => {
    await removeDatabaseProperty(objectDatabase.name, propertyNameToRemove);

    expect(DatabasesStore.get(objectDatabase.name)).toEqual(updatedDatabase);
  });

  it('writes the updated config to the file system', async () => {
    await removeDatabaseProperty(objectDatabase.name, propertyNameToRemove);

    const result = MockFs.readJsonFile<Database>(
      databaseConfigFilePath(updatedDatabase.path),
    );

    expect(result.properties).toEqual(updatedDatabase.properties);
  });
});
