import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import { PropertySchema } from '@minddrop/properties';
import { sqlGetAllEntriesFull, sqlUpsertDatabase } from '../../sql';
import {
  cleanup,
  cleanupTestSqlDatabase,
  objectDatabase,
  objectEntry1,
  objectEntry1SqlRecord,
  setup,
  setupTestSqlDatabase,
} from '../../test-utils';
import { Database } from '../../types';
import { virtualCollectionId, virtualCollectionName } from '../../utils';
import { onAddProperty } from './property-added';

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
      },
      { silent: true },
    );
  });

  afterEach(() => {
    cleanupTestSqlDatabase();
    cleanup();
  });

  it('does nothing if the property is not a collection type', () => {
    // Add a non-collection property
    const property = { type: 'text' as const, name: 'Notes' };

    onAddProperty({
      original: objectDatabase,
      updated: withProperty(objectDatabase, property),
      property,
    });

    // No virtual collections should be created
    const allCollections = Collections.Store.getAllArray();
    const virtualCollections = allCollections.filter((c) => c.virtual);
    expect(virtualCollections).toHaveLength(0);
  });

  it("re-indexes the database's entries in SQL", () => {
    // Add a non-collection property
    const property = { type: 'text' as const, name: 'Notes' };

    onAddProperty({
      original: objectDatabase,
      updated: withProperty(objectDatabase, property),
      property,
    });

    // The database's entries should be re-upserted into SQL
    expect(sqlGetAllEntriesFull()).toContainEqual(objectEntry1SqlRecord);
  });

  it('creates virtual collections for all existing entries', () => {
    // Add a collection property
    const property = { type: 'collection' as const, name: 'Tags' };

    onAddProperty({
      original: objectDatabase,
      updated: withProperty(objectDatabase, property),
      property,
    });

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
});
