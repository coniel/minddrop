import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import { ContentViews } from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { History, Ledgers } from '@minddrop/history';
import { recordEntryHistory } from '../../recordEntryHistory';
import {
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
  objectEntry1,
  relatedEntry1,
  relatedEntry1SqlRecord,
  relatedEntry2,
  relatedEntry2SqlRecord,
  setup,
  setupTestSqlDatabase,
} from '../../test-utils';
import {
  resolveEntriesLedger,
  resolveEntryHistorySubject,
  virtualCollectionId,
  virtualCollectionName,
} from '../../utils';
import { onDeleteEntry } from './entry-deleted';

describe('onDeleteEntry', () => {
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

  afterEach(async () => {
    cleanupTestSqlDatabase();
    await cleanup();
  });

  it('deletes the entry from SQL', async () => {
    // Delete an entry
    await onDeleteEntry(relatedEntry1);

    // The deleted entry's record should be gone from SQL
    const recordIds = sqlGetEntrySyncRecords(collectionDatabase.id).map(
      (record) => record.id,
    );

    expect(recordIds).not.toContain(relatedEntry1.id);
    // Other entry records should be untouched
    expect(recordIds).toContain(relatedEntry2.id);
    expect(recordIds).toContain(collectionEntry1.id);
  });

  it('removes the entry from collections referencing it', async () => {
    // Delete an entry referenced by collectionEntry1's Related collection
    await onDeleteEntry(relatedEntry1);

    const collection = Collections.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );

    expect(collection.items).toEqual([relatedEntry2.id]);
  });

  it('removes the entry from view configs referencing it', async () => {
    const { contentViewType_referencing } = ContentViewFixtures;

    // A view referencing the deleted entry
    ContentViews.createVirtual({
      id: 'content-view_referencing-1',
      type: contentViewType_referencing.type,
      dataSource: { type: 'collection', id: 'collection-1' },
      owner: collectionEntry1.id,
      name: 'Referencing',
      data: { items: [relatedEntry1.id, relatedEntry2.id] },
    });

    await onDeleteEntry(relatedEntry1);

    // The view's config drops the deleted entry
    expect(ContentViews.get('content-view_referencing-1', false)?.data).toEqual(
      {
        items: [relatedEntry2.id],
      },
    );
  });

  it('does nothing if the database has no collection properties', async () => {
    // Call the handler with an entry from a database without collection properties
    await onDeleteEntry(objectEntry1);

    // Virtual collections should still exist
    expect(
      Collections.Store.get(
        virtualCollectionId(collectionEntry1.id, 'Related'),
      ),
    ).not.toBeNull();
  });

  it('deletes virtual collections for the entry', async () => {
    // Call the handler
    await onDeleteEntry(collectionEntry1);

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

  it("closes a named entry's history, which outlives it", async () => {
    await recordEntryHistory(objectDatabase, objectEntry1, {
      kind: 'created',
    });

    await onDeleteEntry(objectEntry1);

    expect(
      await History.read(
        resolveEntryHistorySubject(objectDatabase, objectEntry1),
      ),
    ).toEqual([
      expect.objectContaining({ kind: 'created' }),
      expect.objectContaining({ kind: 'deleted' }),
    ]);
  });

  it("deletes an untitled entry's history", async () => {
    const untitled = { ...objectEntry1, title: 'Untitled' };

    await recordEntryHistory(objectDatabase, untitled, {
      kind: 'created',
    });

    await onDeleteEntry(untitled);

    // The title goes back into the pool, so the next new entry must
    // not inherit what was recorded under it.
    expect(
      await History.read(resolveEntryHistorySubject(objectDatabase, untitled)),
    ).toEqual([]);
  });

  it('records the deletion in the entries ledger', async () => {
    // Delete the entry
    await onDeleteEntry(objectEntry1);

    // The ledger should record the deletion under the entry's title
    expect(await Ledgers.read(resolveEntriesLedger(objectDatabase))).toEqual([
      expect.objectContaining({
        kind: 'deleted',
        subject: { key: objectEntry1.title },
      }),
    ]);
  });

  it("records an untitled entry's deletion in the entries ledger", async () => {
    // An entry with the app's untitled title
    const untitled = { ...objectEntry1, title: 'Untitled' };

    // Delete the entry
    await onDeleteEntry(untitled);

    // The deletion should be in the ledger although the entry's history
    // was deleted.
    expect(await Ledgers.read(resolveEntriesLedger(objectDatabase))).toEqual([
      expect.objectContaining({
        kind: 'deleted',
        subject: { key: 'Untitled' },
      }),
    ]);
  });
});
