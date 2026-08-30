import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import { CollectionFixtures } from '@minddrop/collections/test-utils';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { sqlGetAllEntriesFull, sqlUpsertDatabase } from '../../sql';
import {
  cleanup,
  cleanupTestSqlDatabase,
  collectionDatabase,
  collectionEntry1,
  databases,
  setup,
  setupTestSqlDatabase,
} from '../../test-utils';
import { SqlEntryRecord } from '../../types';
import { virtualCollectionId, virtualCollectionName } from '../../utils';
import { onUpdateCollection } from './collection-updated';

const { collection_virtual_1 } = CollectionFixtures;

// Virtual collection for the Related property
const relatedCollectionId = virtualCollectionId(collectionEntry1.id, 'Related');
const relatedCollection = {
  ...collection_virtual_1,
  id: relatedCollectionId,
  name: virtualCollectionName(
    collectionDatabase.name,
    collectionEntry1.title,
    'Related',
  ),
  items: collectionEntry1.properties.Related as string[],
};

describe('onUpdateCollection', () => {
  beforeEach(() => {
    setup();

    // Open an in-memory SQL database
    setupTestSqlDatabase();

    // Seed each fixture database's SQL record so entry upserts
    // satisfy the database foreign key
    seedSqlDatabases();

    // Add the virtual collection to the store
    Collections.Store.set(relatedCollection);
  });

  afterEach(() => {
    cleanupTestSqlDatabase();
    cleanup();
  });

  it('does nothing for non-virtual collections', async () => {
    const { collection_1 } = CollectionFixtures;

    // Call the handler with a non-virtual collection update
    await onUpdateCollection({
      original: collection_1,
      updated: { ...collection_1, items: ['new-entry'] },
    });

    // Entry should be unchanged
    const entry = DatabaseEntriesStore.get(collectionEntry1.id);
    expect(entry?.properties.Related).toEqual(
      collectionEntry1.properties.Related,
    );
  });

  it('updates the entry property with the collection items', async () => {
    const updatedEntries = ['new-entry-1', 'new-entry-2'];
    const updatedCollection = {
      ...relatedCollection,
      items: updatedEntries,
    };

    // Call the handler
    await onUpdateCollection({
      original: relatedCollection,
      updated: updatedCollection,
    });

    // Entry property should be updated with the new entries
    const entry = DatabaseEntriesStore.get(collectionEntry1.id);
    expect(entry?.properties.Related).toEqual(updatedEntries);
  });

  it('upserts the SQL record with the new membership', async () => {
    const updatedEntries = ['new-entry-1'];

    // Call the handler
    await onUpdateCollection({
      original: relatedCollection,
      updated: { ...relatedCollection, items: updatedEntries },
    });

    // The record should carry the new membership
    const record = recordById(sqlGetAllEntriesFull(), collectionEntry1.id);

    expect(record.databaseId).toBe(collectionDatabase.id);
    expect(propertyValue(record, 'Related')).toEqual(updatedEntries);
  });

  it('does nothing if the entry does not exist', async () => {
    const updatedCollection = {
      ...relatedCollection,
      id: 'nonexistent-entry:Related',
      items: ['new-entry'],
    };

    // Should not throw
    await onUpdateCollection({
      original: { ...relatedCollection, id: 'nonexistent-entry:Related' },
      updated: updatedCollection,
    });
  });
});

/**
 * Seeds each fixture database's SQL record.
 */
function seedSqlDatabases(): void {
  databases.forEach((database) => {
    sqlUpsertDatabase(
      {
        id: database.id,
        name: database.name,
        path: database.path,
        icon: database.icon,
      },
      { silent: true },
    );
  });
}

/**
 * Returns the record with the given ID.
 */
function recordById(records: SqlEntryRecord[], id: string): SqlEntryRecord {
  return records.find((record) => record.id === id)!;
}

/**
 * Returns the value of the named property on a record.
 */
function propertyValue(record: SqlEntryRecord, name: string) {
  return record.properties.find((property) => property.name === name)?.value;
}
