import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PropertySchema } from '@minddrop/properties';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabasesStore } from '../DatabasesStore';
import {
  MockFs,
  cleanup,
  mockDate,
  objectDatabase,
  setup,
} from '../test-utils';
import { Database } from '../types';
import { resolveDatabaseConfigFilePath } from '../utils';
import { updateDatabaseProperty } from './updateDatabaseProperty';

const updatedProperty = {
  ...objectDatabase.properties[0],
  defaultValue: 'Updated Default Value',
} as PropertySchema;

const updatedDatabase = {
  ...objectDatabase,
  properties: [updatedProperty, ...objectDatabase.properties.slice(1)],
  lastModified: mockDate,
};

describe('updateDatabaseProperty', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the property name is changed', async () => {
    await expect(
      updateDatabaseProperty(objectDatabase.id, {
        ...objectDatabase.properties[0],
        name: 'New Name',
      }),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('throws if the property type is changed', async () => {
    await expect(
      // @ts-expect-error Testing invalid parameter
      updateDatabaseProperty(objectDatabase.id, {
        ...objectDatabase.properties[0],
        type: 'number',
      }),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('updates the property in the database', async () => {
    const result = await updateDatabaseProperty(
      objectDatabase.id,
      updatedProperty,
    );

    expect(result).toEqual(updatedDatabase);
  });

  it('updates the database', async () => {
    await updateDatabaseProperty(objectDatabase.id, updatedProperty);

    expect(DatabasesStore).toHaveItem(objectDatabase.id, updatedDatabase);
  });

  it('writes the updated config to the file system', async () => {
    await updateDatabaseProperty(objectDatabase.id, updatedProperty);

    const result = MockFs.readJsonFile<Database>(
      resolveDatabaseConfigFilePath(updatedDatabase.path),
    );

    expect(result.properties).toEqual(updatedDatabase.properties);
  });
});
