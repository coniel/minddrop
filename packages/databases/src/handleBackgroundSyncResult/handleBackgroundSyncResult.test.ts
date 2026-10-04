import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentViews } from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { Events } from '@minddrop/events';
import { History, Ledgers } from '@minddrop/history';
import {
  ItemAddressesChangedEventData,
  ItemReferences,
} from '@minddrop/item-references';
import { storeItem } from '@minddrop/stores/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabasesStore } from '../DatabasesStore';
import { EntriesStore } from '../EntriesStore';
import { recordWorkspaceDatabaseLedger } from '../recordWorkspaceDatabaseLedger';
import { DatabaseFixtures, cleanup, setup } from '../test-utils';
import { BackgroundSyncChangeset } from '../types';
import {
  convertEntryToSqlRecord,
  entryAddress,
  resolveDatabaseHistorySubject,
  resolveWorkspaceDatabaseLedger,
} from '../utils';
import { handleBackgroundSyncResult } from './handleBackgroundSyncResult';

const { collectionDatabase, objectDatabase, relatedEntry1 } = DatabaseFixtures;
const { contentViewType_referencing } = ContentViewFixtures;
const { workspace_1, workspace_2 } = WorkspaceFixtures;

// A changeset without any changes, spread into per-test variants
const emptyChangeset: BackgroundSyncChangeset = {
  workspaceId: workspace_1.id,
  hasChanges: true,
  upsertedDatabases: [],
  deletedDatabaseIds: [],
  upsertedEntries: [],
  deletedEntryIds: [],
};

// The object database renamed while the app was closed
const renamedDatabase = {
  ...objectDatabase,
  name: 'Renamed Objects',
  path: 'Renamed Objects',
};

describe('handleBackgroundSyncResult', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('records a rename of a database made while the app was closed', async () => {
    await handleBackgroundSyncResult({
      ...emptyChangeset,
      upsertedDatabases: [renamedDatabase],
    });

    // The database's history under its new path should record the
    // rename from the name the store held.
    expect(
      await History.read(resolveDatabaseHistorySubject(renamedDatabase)),
    ).toEqual([
      expect.objectContaining({
        kind: 'rename',
        from: objectDatabase.name,
        to: renamedDatabase.name,
      }),
    ]);
  });

  it('records a rename of a database put back from the trash under another name', async () => {
    // Record the database deleted under an earlier name and remove it
    // from the store.
    await recordWorkspaceDatabaseLedger({
      kind: 'deleted',
      subject: { key: 'Old Objects', id: objectDatabase.id },
    });
    DatabasesStore.remove(objectDatabase.id);

    await handleBackgroundSyncResult({
      ...emptyChangeset,
      upsertedDatabases: [objectDatabase],
    });

    // The database's history should record the rename from the
    // deleted name.
    expect(
      await History.read(resolveDatabaseHistorySubject(objectDatabase)),
    ).toEqual([
      expect.objectContaining({
        kind: 'rename',
        from: 'Old Objects',
        to: objectDatabase.name,
      }),
    ]);
  });

  it('records a deletion of a database made while the app was closed', async () => {
    await handleBackgroundSyncResult({
      ...emptyChangeset,
      deletedDatabaseIds: [objectDatabase.id],
    });

    // The ledger should record the deletion under the name the store
    // held.
    expect(await Ledgers.read(resolveWorkspaceDatabaseLedger())).toEqual([
      expect.objectContaining({
        kind: 'deleted',
        subject: { key: objectDatabase.name, id: objectDatabase.id },
      }),
    ]);
  });

  it('records nothing for a deleted database the store did not hold', async () => {
    await handleBackgroundSyncResult({
      ...emptyChangeset,
      deletedDatabaseIds: ['database_unknown'],
    });

    expect(await Ledgers.read(resolveWorkspaceDatabaseLedger())).toEqual([]);
  });

  it("records the deletion in the changeset's workspace", async () => {
    // The database held by the second workspace
    DatabasesStore.in(workspace_2.id).set(objectDatabase);

    await handleBackgroundSyncResult({
      ...emptyChangeset,
      workspaceId: workspace_2.id,
      deletedDatabaseIds: [objectDatabase.id],
    });

    // The second workspace's ledger should record the deletion
    expect(
      await Ledgers.read(resolveWorkspaceDatabaseLedger(workspace_2.path)),
    ).toEqual([
      expect.objectContaining({
        kind: 'deleted',
        subject: { key: objectDatabase.name, id: objectDatabase.id },
      }),
    ]);
  });

  it('dispatches address changes for entries that were renamed', async () => {
    const renamed = {
      ...relatedEntry1,
      title: 'Renamed Related',
      path: `${collectionDatabase.path}/Renamed Related.md`,
    };

    let dispatched: ItemAddressesChangedEventData | undefined;

    Events.addListener(
      ItemReferences.events.AddressesChanged,
      'test',
      (payload) => {
        dispatched = payload;
      },
    );

    // The synced record carries the entry's new title and path
    const record = convertEntryToSqlRecord(renamed, collectionDatabase);

    await handleBackgroundSyncResult({
      ...emptyChangeset,
      upsertedEntries: [record],
    });

    // The store holds the new path
    expect(storeItem(EntriesStore, relatedEntry1.id).path).toBe(renamed.path);

    // The dispatch carries the old and new addresses
    expect(dispatched).toEqual({
      workspaceId: workspace_1.id,
      changes: [
        {
          id: relatedEntry1.id,
          oldReference: entryAddress(relatedEntry1, collectionDatabase),
          newReference: entryAddress(renamed, collectionDatabase),
        },
      ],
    });
  });

  it('dispatches address changes for entries moved to another database', async () => {
    let dispatched: ItemAddressesChangedEventData | undefined;

    Events.addListener(
      ItemReferences.events.AddressesChanged,
      'test',
      (payload) => {
        dispatched = payload;
      },
    );

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
    expect(dispatched).toEqual({
      workspaceId: workspace_1.id,
      changes: [
        {
          id: relatedEntry1.id,
          oldReference: entryAddress(relatedEntry1, collectionDatabase),
          newReference: entryAddress(relatedEntry1, objectDatabase),
        },
      ],
    });
  });

  it('does not dispatch address changes for entries that moved without being renamed', async () => {
    let dispatched = false;

    Events.addListener(ItemReferences.events.AddressesChanged, 'test', () => {
      dispatched = true;
    });

    // The synced record carries a new path under the same title, as
    // when the database's file layout changed outside the app.
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

    Events.addListener(ItemReferences.events.AddressesChanged, 'test', () => {
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
    ContentViews.createVirtual({
      id: 'content-view_referencing-1',
      type: contentViewType_referencing.type,
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
    expect(ContentViews.get('content-view_referencing-1', false)?.data).toEqual(
      {
        items: [],
      },
    );
  });

  it("applies the cascades to the changeset's workspace", async () => {
    // A view referencing the deleted entry, held by the second
    // workspace only.
    ContentViews.Store.in(workspace_2.id).set({
      id: 'content-view_referencing-1',
      type: contentViewType_referencing.type,
      dataSource: { type: 'collection', id: 'collection-1' },
      owner: relatedEntry1.id,
      name: 'Referencing',
      icon: 'lucide:list:blue',
      data: { items: [relatedEntry1.id] },
      references: [relatedEntry1.id],
      virtual: true,
      created: new Date(),
      lastModified: new Date(),
    });

    await handleBackgroundSyncResult({
      ...emptyChangeset,
      workspaceId: workspace_2.id,
      deletedEntryIds: [relatedEntry1.id],
    });

    // The second workspace's view drops the deleted entry
    expect(
      ContentViews.get('content-view_referencing-1', false, workspace_2.id)
        ?.data,
    ).toEqual({ items: [] });
  });
});
