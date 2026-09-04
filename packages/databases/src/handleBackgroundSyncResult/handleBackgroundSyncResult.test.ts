import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataViews } from '@minddrop/data-views';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { Events } from '@minddrop/events';
import {
  ItemAddressesChangedEvent,
  ItemAddressesChangedEventData,
} from '@minddrop/item-references';
import { DatabaseEntriesStore } from '../DatabaseEntriesStore';
import {
  cleanup,
  collectionDatabase,
  objectDatabase,
  relatedEntry1,
  setup,
} from '../test-utils';
import { BackgroundSyncChangeset } from '../types';
import { convertEntryToSqlRecord, databaseEntryAddress } from '../utils';
import { handleBackgroundSyncResult } from './handleBackgroundSyncResult';

const { dataViewType_referencing } = DataViewFixtures;

// A changeset without any changes, spread into per-test variants
const emptyChangeset: BackgroundSyncChangeset = {
  hasChanges: true,
  upsertedDatabases: [],
  deletedDatabaseIds: [],
  upsertedEntries: [],
  deletedEntryIds: [],
};

describe('handleBackgroundSyncResult', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('dispatches address changes for entries that were renamed', async () => {
    const renamed = {
      ...relatedEntry1,
      title: 'Renamed Related',
      path: `${collectionDatabase.path}/Renamed Related.md`,
    };

    let dispatched: ItemAddressesChangedEventData | undefined;

    Events.addListener(ItemAddressesChangedEvent, 'test', (payload) => {
      dispatched = payload;
    });

    // The synced record carries the entry's new title and path
    const record = convertEntryToSqlRecord(renamed, collectionDatabase);

    await handleBackgroundSyncResult({
      ...emptyChangeset,
      upsertedEntries: [record],
    });

    // The store holds the new path
    expect(DatabaseEntriesStore.get(relatedEntry1.id)?.path).toBe(renamed.path);

    // The dispatch carries the old and new addresses
    expect(dispatched).toEqual([
      {
        id: relatedEntry1.id,
        oldReference: databaseEntryAddress(relatedEntry1, collectionDatabase),
        newReference: databaseEntryAddress(renamed, collectionDatabase),
      },
    ]);
  });

  it('dispatches address changes for entries moved to another database', async () => {
    let dispatched: ItemAddressesChangedEventData | undefined;

    Events.addListener(ItemAddressesChangedEvent, 'test', (payload) => {
      dispatched = payload;
    });

    // The synced record places the entry in another database
    const record = convertEntryToSqlRecord(
      {
        ...relatedEntry1,
        database: objectDatabase.id,
        path: `${objectDatabase.path}/${relatedEntry1.title}.md`,
      },
      objectDatabase,
    );

    await handleBackgroundSyncResult({
      ...emptyChangeset,
      upsertedEntries: [record],
    });

    // The dispatch names the entry under either database
    expect(dispatched).toEqual([
      {
        id: relatedEntry1.id,
        oldReference: databaseEntryAddress(relatedEntry1, collectionDatabase),
        newReference: databaseEntryAddress(relatedEntry1, objectDatabase),
      },
    ]);
  });

  it('does not dispatch address changes for entries that moved without being renamed', async () => {
    let dispatched = false;

    Events.addListener(ItemAddressesChangedEvent, 'test', () => {
      dispatched = true;
    });

    // The synced record carries a new path under the same title, as
    // when the database's file layout changed outside the app
    const record = convertEntryToSqlRecord(
      {
        ...relatedEntry1,
        path: `${collectionDatabase.path}/${relatedEntry1.title}/${relatedEntry1.title}.md`,
      },
      collectionDatabase,
    );

    await handleBackgroundSyncResult({
      ...emptyChangeset,
      upsertedEntries: [record],
    });

    expect(dispatched).toBe(false);
  });

  it('does not dispatch address changes for unchanged entries', async () => {
    let dispatched = false;

    Events.addListener(ItemAddressesChangedEvent, 'test', () => {
      dispatched = true;
    });

    // The synced record carries the entry's unchanged title and path
    const record = convertEntryToSqlRecord(relatedEntry1, collectionDatabase);

    await handleBackgroundSyncResult({
      ...emptyChangeset,
      upsertedEntries: [record],
    });

    expect(dispatched).toBe(false);
  });

  it('removes deleted entries from referencing view configs', async () => {
    // A view referencing the deleted entry
    DataViews.createVirtual({
      id: 'data-view_referencing-1',
      type: dataViewType_referencing.type,
      dataSource: { type: 'collection', id: 'collection-1' },
      owner: relatedEntry1.id,
      name: 'Referencing',
      data: { items: [relatedEntry1.id] },
    });

    await handleBackgroundSyncResult({
      ...emptyChangeset,
      deletedEntryIds: [relatedEntry1.id],
    });

    // The view's config drops the deleted entry
    expect(DataViews.get('data-view_referencing-1', false)?.data).toEqual({
      items: [],
    });
  });
});
