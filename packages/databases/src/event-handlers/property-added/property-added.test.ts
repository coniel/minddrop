import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import { History } from '@minddrop/history';
import { PropertySchema } from '@minddrop/properties';
import { sqlGetEntriesFull, sqlUpsertDatabase } from '../../sql';
import {
  DatabaseFixtures,
  cleanup,
  cleanupTestSqlDatabase,
  objectDatabase,
  objectEntry1,
  objectEntry1SqlRecord,
  setup,
  setupTestSqlDatabase,
} from '../../test-utils';
import { Database } from '../../types';
import {
  resolveDatabaseHistorySubject,
  virtualCollectionId,
  virtualCollectionName,
} from '../../utils';
import { onAddProperty } from './property-added';

// The action performing the addition
const { historyAction_propertyAdded: action } = DatabaseFixtures;

/**
 * Returns a copy of a database with the property added to its
 * schema, matching the database shape carried by the property
 * added event.
 */
function withProperty(database: Database, property: PropertySchema): Database {
  return {
    ...database,
    properties: [...database.properties, property],
  };
}

/**
 * Runs the handler for the addition of a property to the object
 * database.
 */
function addProperty(property: PropertySchema): Promise<void> {
  return onAddProperty({
    original: objectDatabase,
    updated: withProperty(objectDatabase, property),
    property,
    action,
  });
}

describe('onAddProperty', () => {
  beforeEach(() => {
    setup();

    // Open an in-memory SQL database
    setupTestSqlDatabase();

    // Seed the database record the re-indexed entries belong to
    sqlUpsertDatabase(
      {
        id: objectDatabase.id,
        name: objectDatabase.name,
        path: objectDatabase.path,
        icon: objectDatabase.icon,
        properties: objectDatabase.properties,
      },
      { silent: true },
    );
  });

  afterEach(async () => {
    cleanupTestSqlDatabase();
    await cleanup();
  });

  it('does nothing if the property is not a collection type', async () => {
    // Add a non-collection property
    await addProperty({ type: 'text', name: 'Notes' });

    // No virtual collections should be created
    const allCollections = Collections.Store.getAllArray();
    const virtualCollections = allCollections.filter((c) => c.virtual);
    expect(virtualCollections).toHaveLength(0);
  });

  it("re-indexes the database's entries in SQL", async () => {
    // Add a non-collection property
    await addProperty({ type: 'text', name: 'Notes' });

    // The database's entries should be re-upserted into SQL
    expect(sqlGetEntriesFull()).toContainEqual(objectEntry1SqlRecord);
  });

  it('creates virtual collections for all existing entries', async () => {
    // Add a collection property
    await addProperty({ type: 'collection', name: 'Tags' });

    // Should create a virtual collection for the existing entry
    const collection = Collections.Store.get(
      virtualCollectionId(objectEntry1.id, 'Tags'),
    );
    expect(collection).not.toBeNull();
    expect(collection!.virtual).toBe(true);
    expect(collection!.name).toBe(
      virtualCollectionName(objectDatabase.name, objectEntry1.title, 'Tags'),
    );
    expect(collection!.items).toEqual([]);
  });

  it("records the property's definition against the database's history", async () => {
    // A select property with an option
    const property: PropertySchema = {
      type: 'select',
      name: 'Status',
      options: [{ value: 'Todo', color: 'blue' }],
    };

    // Add the property
    await addProperty(property);

    // The database's history should hold the property's definition
    expect(
      await History.read(resolveDatabaseHistorySubject(objectDatabase)),
    ).toEqual([
      expect.objectContaining({
        kind: 'definition',
        changes: [{ part: 'Status', from: null, to: property }],
        action,
      }),
    ]);
  });
});
