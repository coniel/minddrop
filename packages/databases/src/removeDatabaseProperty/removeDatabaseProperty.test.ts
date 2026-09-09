import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabasesStore } from '../DatabasesStore';
import {
  MockFs,
  cleanup,
  mockDate,
  objectDatabase,
  setup,
} from '../test-utils';
import { Database } from '../types';
import { resolveDatabaseConfigFilePath, resolveDatabasePath } from '../utils';
import { removeDatabaseProperty } from './removeDatabaseProperty';

const propertyNameToRemove = objectDatabase.properties[0].name;

const updatedDatabase = {
  ...objectDatabase,
  properties: objectDatabase.properties.slice(1),
  lastModified: mockDate,
};

describe('removeDatabaseProperty', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the property from the database', async () => {
    const result = await removeDatabaseProperty(
      objectDatabase.id,
      propertyNameToRemove,
    );

    expect(result).toEqual(updatedDatabase);
  });

  it('updates the database', async () => {
    await removeDatabaseProperty(objectDatabase.id, propertyNameToRemove);

    expect(DatabasesStore).toHaveItem(objectDatabase.id, updatedDatabase);
  });

  it('writes the updated config to the file system', async () => {
    await removeDatabaseProperty(objectDatabase.id, propertyNameToRemove);

    const result = MockFs.readJsonFile<Database>(
      resolveDatabaseConfigFilePath(resolveDatabasePath(updatedDatabase)),
    );

    expect(result.properties).toEqual(updatedDatabase.properties);
  });
});
