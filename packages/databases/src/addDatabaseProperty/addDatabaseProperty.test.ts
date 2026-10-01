import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { PropertySchema } from '@minddrop/properties';
import { InvalidParameterError } from '@minddrop/utils';
import { DatabasesStore } from '../DatabasesStore';
import { DatabaseHistoryCauses } from '../constants';
import { DatabasePropertyAddedEvent } from '../events';
import {
  MockFs,
  cleanup,
  mockDate,
  objectDatabase,
  setup,
} from '../test-utils';
import { Database } from '../types';
import { resolveDatabaseConfigFilePath, resolveDatabasePath } from '../utils';
import { addDatabaseProperty } from './addDatabaseProperty';

const newProperty: PropertySchema = {
  name: 'New Property',
  type: 'text',
};

const updatedDatabase: Database = {
  ...objectDatabase,
  properties: [...objectDatabase.properties, newProperty],
  lastModified: mockDate,
};

describe('addDatabaseProperty', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds the property to the database', async () => {
    const result = await addDatabaseProperty(objectDatabase.id, newProperty);

    expect(result).toEqual(updatedDatabase);
  });

  it('updates the database', async () => {
    await addDatabaseProperty(objectDatabase.id, newProperty);

    expect(DatabasesStore).toHaveItem(objectDatabase.id, updatedDatabase);
  });

  it('dispatches the property added event', async () => {
    // The captured event data
    let eventData: unknown;

    // Capture the dispatched event data
    Events.addListener(DatabasePropertyAddedEvent, 'test', (data) => {
      eventData = data;
    });

    // Add the property
    await addDatabaseProperty(objectDatabase.id, newProperty);

    // Stop capturing
    Events.removeListener(DatabasePropertyAddedEvent, 'test');

    // The event should have the property, the updated database and the
    // action adding it.
    expect(eventData).toMatchObject({
      property: newProperty,
      updated: updatedDatabase,
      action: {
        id: expect.stringMatching(/^action_/),
        cause: DatabaseHistoryCauses.PropertyAdded,
      },
    });
  });

  it('writes the updated config to the file system', async () => {
    await addDatabaseProperty(objectDatabase.id, newProperty);

    const result = MockFs.readJsonFile<Database>(
      resolveDatabaseConfigFilePath(resolveDatabasePath(updatedDatabase)),
    );

    expect(result.properties).toEqual(updatedDatabase.properties);
  });

  it('throws when the database already has a property of a singleton type', async () => {
    // objectDatabase already declares a content property
    await expect(
      addDatabaseProperty(objectDatabase.id, {
        name: 'Second Content',
        type: 'content',
      }),
    ).rejects.toThrowError(InvalidParameterError);
  });

  it('does not add a duplicate singleton property to the database', async () => {
    await addDatabaseProperty(objectDatabase.id, {
      name: 'Second Content',
      type: 'content',
    }).catch(() => null);

    expect(DatabasesStore).toHaveItem(objectDatabase.id, objectDatabase);
  });
});
