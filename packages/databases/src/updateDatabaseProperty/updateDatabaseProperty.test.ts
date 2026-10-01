import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { PropertySchema } from '@minddrop/properties';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseHistoryCauses } from '../constants';
import { DatabasePropertyUpdatedEvent, DatabaseUpdatedEvent } from '../events';
import {
  MockFs,
  cleanup,
  mockDate,
  objectDatabase,
  setup,
} from '../test-utils';
import { Database } from '../types';
import { resolveDatabaseConfigFilePath, resolveDatabasePath } from '../utils';
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

  it('dispatches the database updated event', async () => {
    // The captured event data
    let eventData: unknown;

    // Capture the dispatched event data
    Events.addListener(DatabaseUpdatedEvent, 'test', (data) => {
      eventData = data;
    });

    // Update the property
    await updateDatabaseProperty(objectDatabase.id, updatedProperty);

    // Stop capturing
    Events.removeListener(DatabaseUpdatedEvent, 'test');

    // The event should have the database before and after the update
    expect(eventData).toEqual({
      original: objectDatabase,
      updated: updatedDatabase,
    });
  });

  it('dispatches the property updated event', async () => {
    // The captured event data
    let eventData: unknown;

    // Capture the dispatched event data
    Events.addListener(DatabasePropertyUpdatedEvent, 'test', (data) => {
      eventData = data;
    });

    // Update the property
    await updateDatabaseProperty(objectDatabase.id, updatedProperty);

    // Stop capturing
    Events.removeListener(DatabasePropertyUpdatedEvent, 'test');

    // The event should have the database and the property before and
    // after the update, and the action updating it.
    expect(eventData).toMatchObject({
      original: objectDatabase,
      updated: updatedDatabase,
      originalProperty: objectDatabase.properties[0],
      updatedProperty,
      action: {
        id: expect.stringMatching(/^action_/),
        cause: DatabaseHistoryCauses.PropertyUpdated,
      },
    });
  });

  it('writes the updated config to the file system', async () => {
    await updateDatabaseProperty(objectDatabase.id, updatedProperty);

    const result = MockFs.readJsonFile<Database>(
      resolveDatabaseConfigFilePath(resolveDatabasePath(updatedDatabase)),
    );

    expect(result.properties).toEqual(updatedDatabase.properties);
  });
});
