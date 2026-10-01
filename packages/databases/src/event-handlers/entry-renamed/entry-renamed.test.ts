import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Collections } from '@minddrop/collections';
import { Events } from '@minddrop/events';
import { History, Ledgers } from '@minddrop/history';
import { ItemReferences } from '@minddrop/item-references';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { recordDatabaseEntryHistory } from '../../recordDatabaseEntryHistory';
import { sqlGetAllEntriesFull, sqlUpsertDatabase } from '../../sql';
import {
  MockFs,
  cleanup,
  cleanupTestSqlDatabase,
  collectionDatabase,
  collectionEntry1,
  databaseDirPath,
  databaseEntryFilePath,
  databases,
  historyAction_entryRenamed,
  objectDatabase,
  objectEntry1,
  relatedEntry1,
  setup,
  setupTestSqlDatabase,
} from '../../test-utils';
import { DatabaseEntryMetadata } from '../../types';
import {
  resolveDatabaseEntryHistorySubject,
  resolveDatabaseEntryLedger,
  resolveEntryMetadataFilePath,
  virtualCollectionId,
  virtualCollectionName,
} from '../../utils';
import { onItemAddressesChanged } from '../item-addresses-changed';
import { onRenameEntry } from './entry-renamed';

// The action performing the rename
const action = historyAction_entryRenamed;

// The renamed version of collectionEntry1: same ID, new title and path
const renamedEntry = {
  ...collectionEntry1,
  title: 'Renamed Entry',
  path: 'Renamed Entry.md',
};

// The entry's metadata sidecar before and after the rename
const oldSidecarPath = resolveEntryMetadataFilePath(
  databaseDirPath(collectionDatabase),
  databaseEntryFilePath(collectionEntry1),
);
const newSidecarPath = resolveEntryMetadataFilePath(
  databaseDirPath(collectionDatabase),
  renamedEntry.path,
);

describe('onRenameEntry', () => {
  beforeEach(() => {
    setup();

    // Open an in-memory SQL database
    setupTestSqlDatabase();

    // Seed each fixture database's SQL record so entry upserts
    // satisfy the database foreign key.
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

    // Register the reference rewrite listener normally wired by
    // initializeDatabaseEventHandlers.
    Events.on(ItemReferences.events.AddressesChanged, 'test', (data) =>
      onItemAddressesChanged(data),
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

  it("refreshes the entry's SQL record", async () => {
    await onRenameEntry({
      original: collectionEntry1,
      updated: renamedEntry,
      action,
    });

    // The record carries the new title
    expect(sqlGetAllEntriesFull()).toContainEqual(
      expect.objectContaining({
        id: collectionEntry1.id,
        title: renamedEntry.title,
      }),
    );
  });

  it('does nothing if the database has no collection properties', async () => {
    // Call the handler with an entry from a database without collection properties
    await onRenameEntry({
      original: objectEntry1,
      updated: { ...objectEntry1, title: 'Renamed' },
      action,
    });

    // Virtual collection names should be unchanged
    const collection = Collections.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    expect(collection.name).toBe(
      virtualCollectionName(
        collectionDatabase.name,
        collectionEntry1.title,
        'Related',
      ),
    );
  });

  it('moves the sidecar from the old to the new entry path', async () => {
    const entryMetadata: DatabaseEntryMetadata = {
      color: 'red',
    };

    // Write a sidecar for the original entry
    MockFs.addFiles([
      {
        path: oldSidecarPath,
        textContent: JSON.stringify(entryMetadata),
      },
    ]);

    // Update the store to reflect the rename
    DatabaseEntriesStore.set(renamedEntry);

    await onRenameEntry({
      original: collectionEntry1,
      updated: renamedEntry,
      action,
    });

    // The sidecar should have followed the entry
    expect(JSON.parse(MockFs.readTextFile(newSidecarPath))).toEqual(
      entryMetadata,
    );
    expect(MockFs.exists(oldSidecarPath)).toBe(false);
  });

  it('upserts the SQL entry record under the same ID', async () => {
    const renamedObjectEntry = { ...objectEntry1, title: 'Renamed' };

    // Update the store to reflect the rename
    DatabaseEntriesStore.update(objectEntry1.id, {
      title: renamedObjectEntry.title,
    });

    await onRenameEntry({
      original: objectEntry1,
      updated: renamedObjectEntry,
      action,
    });

    // The SQL record should carry the new title under the same ID
    expect(sqlGetAllEntriesFull()).toContainEqual(
      expect.objectContaining({
        id: objectEntry1.id,
        databaseId: objectEntry1.database,
        title: 'Renamed',
      }),
    );
  });

  it('updates virtual collection names to the new entry title', async () => {
    // Update the store to reflect the rename
    DatabaseEntriesStore.set(renamedEntry);

    await onRenameEntry({
      original: collectionEntry1,
      updated: renamedEntry,
      action,
    });

    // Look up the virtual collections
    const relatedCollection = Collections.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    const referencesCollection = Collections.get(
      virtualCollectionId(collectionEntry1.id, 'References'),
    );

    // Collection names should reflect the new entry title
    expect(relatedCollection.name).toBe(
      virtualCollectionName(
        collectionDatabase.name,
        'Renamed Entry',
        'Related',
      ),
    );
    expect(referencesCollection.name).toBe(
      virtualCollectionName(
        collectionDatabase.name,
        'Renamed Entry',
        'References',
      ),
    );
  });

  it("rewrites referencing entries' files with the new address", async () => {
    // Rename a referenced entry
    const renamedRelated = {
      ...relatedEntry1,
      title: 'Renamed Related',
      path: `${collectionDatabase.path}/Renamed Related.md`,
    };

    // Update the store to reflect the rename
    DatabaseEntriesStore.update(relatedEntry1.id, {
      title: renamedRelated.title,
      path: renamedRelated.path,
    });

    await onRenameEntry({
      original: relatedEntry1,
      updated: renamedRelated,
      action,
    });

    // The rewrite lands as an unawaited event side effect, so
    // poll for the referencing file to contain the new address.
    await vi.waitFor(() => {
      expect(
        MockFs.readTextFile(databaseEntryFilePath(collectionEntry1)),
      ).toContain('Collection Database/Renamed Related');
    });
  });

  it('handles entries without collection properties', async () => {
    // objectEntry1 is in objectDatabase which has no collection properties
    await onRenameEntry({
      original: objectEntry1,
      updated: { ...objectEntry1, title: 'Renamed' },
      action,
    });

    // Should complete without error, collections should be untouched
    expect(
      Collections.Store.get(
        virtualCollectionId(collectionEntry1.id, 'Related'),
      ),
    ).not.toBeNull();
  });

  it("records the rename and moves the entry's history", async () => {
    // Record something against the entry under its old title
    await recordDatabaseEntryHistory(objectDatabase, objectEntry1, {
      kind: 'created',
    });

    await onRenameEntry({
      original: objectEntry1,
      updated: { ...objectEntry1, title: 'Renamed' },
      action,
    });

    // The history should have followed the entry to its new title.
    // The rename should be recorded in it with the event's action.
    expect(
      await History.read(
        resolveDatabaseEntryHistorySubject(objectDatabase, {
          ...objectEntry1,
          title: 'Renamed',
        }),
      ),
    ).toEqual([
      expect.objectContaining({ kind: 'created' }),
      expect.objectContaining({
        kind: 'rename',
        target: 'self',
        from: objectEntry1.title,
        to: 'Renamed',
        action,
      }),
    ]);
  });

  it('records the rename in the entries ledger under the old title', async () => {
    // Call the handler
    await onRenameEntry({
      original: objectEntry1,
      updated: { ...objectEntry1, title: 'Renamed' },
      action,
    });

    // The ledger should record the rename under the old title, with
    // the event's action.
    expect(
      await Ledgers.read(resolveDatabaseEntryLedger(objectDatabase)),
    ).toEqual([
      expect.objectContaining({
        kind: 'rename',
        subject: { key: objectEntry1.title },
        to: 'Renamed',
        action,
      }),
    ]);
  });

  it('does not record a rename from an untitled title in the ledger', async () => {
    // An entry with the app's untitled title
    const untitled = { ...objectEntry1, title: 'Untitled 2' };

    // Call the handler
    await onRenameEntry({
      original: untitled,
      updated: { ...untitled, title: 'Named' },
      action,
    });

    // Nothing references an entry by the title the app handed out, so
    // the ledger has nothing to resolve from it.
    expect(
      await Ledgers.read(resolveDatabaseEntryLedger(objectDatabase)),
    ).toEqual([]);
  });

  it("puts the rename's action on the address change it dispatches", async () =>
    new Promise<void>((done) => {
      // Listen for the address change. The 'test' listener ID is taken
      // by the rewrite listener registered in setup.
      Events.addListener(
        ItemReferences.events.AddressesChanged,
        'test-capture',
        (data) => {
          // The address change should have the rename's action
          expect(data.action).toEqual(action);
          done();
        },
      );

      onRenameEntry({
        original: objectEntry1,
        updated: { ...objectEntry1, title: 'Renamed' },
        action,
      });
    }));

  it("records the entry's own rename, the ledger rename and the reference renames under one action", async () => {
    // The renamed version of relatedEntry1. collectionEntry1 references
    // it.
    const renamedRelated = {
      ...relatedEntry1,
      title: 'Renamed Related',
      path: 'Renamed Related.md',
    };

    // Update the store to reflect the rename, so the reference rewrite
    // sees the new title.
    DatabaseEntriesStore.update(relatedEntry1.id, {
      title: renamedRelated.title,
      path: renamedRelated.path,
    });

    await onRenameEntry({
      original: relatedEntry1,
      updated: renamedRelated,
      action,
    });

    // Wait for the reference record before reading the three records
    // together. An unawaited event side effect writes it.
    await vi.waitFor(async () => {
      expect(
        await History.read(
          resolveDatabaseEntryHistorySubject(
            collectionDatabase,
            collectionEntry1,
          ),
        ),
      ).toHaveLength(1);
    });

    // Read the three records
    const records = await Promise.all([
      // The entry's own history
      History.read(
        resolveDatabaseEntryHistorySubject(collectionDatabase, renamedRelated),
      ),
      // The entries ledger
      Ledgers.read(resolveDatabaseEntryLedger(collectionDatabase)),
      // The referencing entry's history
      History.read(
        resolveDatabaseEntryHistorySubject(
          collectionDatabase,
          collectionEntry1,
        ),
      ),
    ]);

    // All three records should have the same action
    expect(records.flat().map((record) => record.action)).toEqual([
      action,
      action,
      action,
    ]);
  });
});
