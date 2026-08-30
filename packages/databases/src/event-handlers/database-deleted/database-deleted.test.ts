import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import {
  sqlGetAllDatabases,
  sqlGetEntrySyncRecords,
  sqlUpsertDatabase,
  sqlUpsertEntries,
} from '../../sql';
import {
  cleanup,
  cleanupTestSqlDatabase,
  collectionDatabase,
  collectionEntry1,
  collectionEntry1SqlRecord,
  objectDatabase,
  rootStorageDatabase,
  setup,
  setupTestSqlDatabase,
} from '../../test-utils';
import { virtualCollectionId, virtualCollectionName } from '../../utils';
import { onDeleteDatabase } from './database-deleted';

describe('onDeleteDatabase', () => {
  beforeEach(() => {
    setup();

    // Open an in-memory SQL database
    setupTestSqlDatabase();

    // Seed the collection database record
    sqlUpsertDatabase(
      {
        id: collectionDatabase.id,
        name: collectionDatabase.name,
        path: collectionDatabase.path,
        icon: collectionDatabase.icon,
      },
      { silent: true },
    );

    // Seed one of the collection database's entry records
    sqlUpsertEntries(collectionDatabase.id, [collectionEntry1SqlRecord], {
      silent: true,
    });

    // Create virtual collections for the collection entry
    Collections.createVirtual(
      virtualCollectionId(collectionEntry1.id, 'Related'),
      virtualCollectionName(
        collectionDatabase.name,
        collectionEntry1.title,
        'Related',
      ),
      collectionEntry1.properties.Related as string[],
    );
    Collections.createVirtual(
      virtualCollectionId(collectionEntry1.id, 'References'),
      virtualCollectionName(
        collectionDatabase.name,
        collectionEntry1.title,
        'References',
      ),
      collectionEntry1.properties.References as string[],
    );
  });

  afterEach(() => {
    cleanupTestSqlDatabase();
    cleanup();
  });

  it('deletes the database and its entries from SQL', async () => {
    // Delete the collection database
    await onDeleteDatabase(collectionDatabase);

    // The database record should be gone from SQL
    expect(sqlGetAllDatabases()).not.toContainEqual(
      expect.objectContaining({ id: collectionDatabase.id }),
    );

    // The database's entry records should be cascade deleted
    expect(sqlGetEntrySyncRecords(collectionDatabase.id)).toEqual([]);
  });

  it('does nothing if the database has no collection properties', async () => {
    // Delete a database without collection properties
    await onDeleteDatabase(objectDatabase);

    // Virtual collections should be unchanged
    const related = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    expect(related).not.toBeNull();
  });

  it('deletes all virtual collections for the database entries', async () => {
    // Delete the collection database
    await onDeleteDatabase(collectionDatabase);

    // All virtual collections should be deleted
    const related = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    const references = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'References'),
    );

    expect(related).toBeNull();
    expect(references).toBeNull();
  });

  it("removes the database's entries from collections referencing them", async () => {
    // Delete the database containing referenceEntry1, which is
    // referenced by collectionEntry1's References collection
    await onDeleteDatabase(rootStorageDatabase);

    const references = Collections.get(
      virtualCollectionId(collectionEntry1.id, 'References'),
    );

    expect(references.items).toEqual([]);
  });
});
