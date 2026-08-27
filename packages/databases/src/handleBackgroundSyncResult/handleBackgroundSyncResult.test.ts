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

  it('dispatches address changes for entries that moved', async () => {
    const renamedPath = `${collectionDatabase.path}/Renamed Related.md`;

    let dispatched: ItemAddressesChangedEventData | undefined;

    Events.addListener(ItemAddressesChangedEvent, 'test', (payload) => {
      dispatched = payload.data;
    });

    // The synced record carries the entry's new path
    const record = convertEntryToSqlRecord(
      { ...relatedEntry1, path: renamedPath },
      collectionDatabase,
    );

    await handleBackgroundSyncResult({
      ...emptyChangeset,
      upsertedEntries: [record],
    });

    // The store holds the new path
    expect(DatabaseEntriesStore.get(relatedEntry1.id)?.path).toBe(renamedPath);

    // The dispatch carries the old and new addresses
    expect(dispatched).toEqual([
      {
        id: relatedEntry1.id,
        oldReference: databaseEntryAddress(relatedEntry1.path),
        newReference: databaseEntryAddress(renamedPath),
      },
    ]);
  });

  it('does not dispatch address changes for unmoved entries', async () => {
    let dispatched = false;

    Events.addListener(ItemAddressesChangedEvent, 'test', () => {
      dispatched = true;
    });

    // The synced record carries the entry's unchanged path
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
