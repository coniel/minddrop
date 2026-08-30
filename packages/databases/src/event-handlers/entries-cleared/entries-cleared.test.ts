import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import {
  sqlGetEntrySyncRecords,
  sqlUpsertDatabase,
  sqlUpsertEntries,
} from '../../sql';
import {
  cleanup,
  cleanupRecordingTestSqlDatabase,
  clearRecordedSqlStatements,
  collectionDatabase,
  collectionEntry1,
  collectionEntry1SqlRecord,
  getRecordedSqlStatements,
  objectDatabase,
  objectEntry1,
  relatedEntry1,
  relatedEntry1SqlRecord,
  relatedEntry2,
  relatedEntry2SqlRecord,
  setup,
  setupRecordingTestSqlDatabase,
} from '../../test-utils';
import { virtualCollectionId, virtualCollectionName } from '../../utils';
import { onClearEntries } from './entries-cleared';

describe('onClearEntries', () => {
  beforeEach(() => {
    setup();

    // Open a recording in-memory SQL database
    setupRecordingTestSqlDatabase();

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

    // Seed the collection database's entry records
    sqlUpsertEntries(
      collectionDatabase.id,
      [
        relatedEntry1SqlRecord,
        relatedEntry2SqlRecord,
        collectionEntry1SqlRecord,
      ],
      { silent: true },
    );

    // Drop the seeding statements so tests only see the handler's SQL
    clearRecordedSqlStatements();

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
    cleanupRecordingTestSqlDatabase();
    cleanup();
  });

  it('does nothing if no entries were cleared', async () => {
    // Call the handler with no entries
    await onClearEntries({ databaseId: collectionDatabase.id, entries: [] });

    // Virtual collections should still exist
    expect(
      Collections.Store.get(
        virtualCollectionId(collectionEntry1.id, 'Related'),
      ),
    ).not.toBeNull();

    // No entry delete statements should have been executed
    const deleteStatements = getRecordedSqlStatements().filter((statement) =>
      statement.sql.startsWith('DELETE FROM entries'),
    );

    expect(deleteStatements).toEqual([]);
  });

  it('deletes the cleared entries from SQL in a single batch', async () => {
    // Clear two entries
    await onClearEntries({
      databaseId: collectionDatabase.id,
      entries: [relatedEntry1, relatedEntry2],
    });

    // The cleared entries' records should be gone from SQL
    const recordIds = sqlGetEntrySyncRecords(collectionDatabase.id).map(
      (record) => record.id,
    );

    expect(recordIds).not.toContain(relatedEntry1.id);
    expect(recordIds).not.toContain(relatedEntry2.id);
    // Other entry records should be untouched
    expect(recordIds).toContain(collectionEntry1.id);
  });

  it('does nothing if the database has no collection properties', async () => {
    // Call the handler with an entry from a database without collection properties
    await onClearEntries({
      databaseId: objectDatabase.id,
      entries: [objectEntry1],
    });

    // Virtual collections should still exist
    expect(
      Collections.Store.get(
        virtualCollectionId(collectionEntry1.id, 'Related'),
      ),
    ).not.toBeNull();
  });

  it('deletes virtual collections for the cleared entries', async () => {
    // Call the handler
    await onClearEntries({
      databaseId: collectionDatabase.id,
      entries: [collectionEntry1],
    });

    // Virtual collections should be removed from the store
    expect(
      Collections.Store.get(
        virtualCollectionId(collectionEntry1.id, 'Related'),
      ),
    ).toBeNull();
    expect(
      Collections.Store.get(
        virtualCollectionId(collectionEntry1.id, 'References'),
      ),
    ).toBeNull();
  });

  it('removes the cleared entries from collections referencing them', async () => {
    // Clear entries referenced by collectionEntry1's Related collection
    await onClearEntries({
      databaseId: collectionDatabase.id,
      entries: [relatedEntry1, relatedEntry2],
    });

    const collection = Collections.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );

    expect(collection.items).toEqual([]);
  });
});
