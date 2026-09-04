import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import { DataViews } from '@minddrop/data-views';
import { DesignFixtures } from '@minddrop/designs/test-utils';
import { Events } from '@minddrop/events';
import { ItemAddressesChangedEvent } from '@minddrop/item-references';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { DatabasesStore } from '../../DatabasesStore';
import {
  DatabaseEntriesSqlSyncedEvent,
  DatabaseEntriesSqlSyncedEventData,
  DatabaseSqlSyncedEvent,
  DatabaseSqlSyncedEventData,
} from '../../events';
import { sqlGetAllDatabases, sqlGetEntrySyncRecords } from '../../sql';
import {
  MockFs,
  cleanup,
  cleanupRecordingTestSqlDatabase,
  collectionDatabase,
  collectionEntry1,
  getRecordedSqlStatements,
  noPropertiesDatabase,
  objectDatabase,
  parentDir,
  rootStorageDatabase,
  setup,
  setupRecordingTestSqlDatabase,
} from '../../test-utils';
import {
  viewMetadataKey,
  virtualCollectionId,
  virtualCollectionName,
  virtualViewId,
} from '../../utils';
import { onItemAddressesChanged } from '../item-addresses-changed';
import { onRenameDatabase } from './database-renamed';

const { layout_card_2, layout_card_3 } = DesignFixtures;

// The collection database renamed to a new name/ID
const renamedDatabase = {
  ...collectionDatabase,
  name: 'Renamed Database',
  path: `${parentDir}/Renamed Database`,
};

// The expected new path for collectionEntry1 after the rename
const renamedEntryPath = `${parentDir}/Renamed Database/Collection Entry 1.md`;

describe('onRenameDatabase', () => {
  beforeEach(() => {
    setup();

    // Open a recording in-memory SQL database
    setupRecordingTestSqlDatabase();

    // Register the reference rewrite listener normally wired by
    // initializeDatabaseEventHandlers
    Events.on(ItemAddressesChangedEvent, 'test', (data) =>
      onItemAddressesChanged(data),
    );

    // Create the renamed database directory so reference
    // rewrites can write moved entry files
    MockFs.addFiles([renamedDatabase.path]);

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

    // Create virtual views for each collection property in each layout
    [layout_card_2.id, layout_card_3.id].forEach((layoutId) => {
      DataViews.createVirtual({
        id: virtualViewId(collectionEntry1.id, layoutId, 'Related'),
        type: 'board',
        dataSource: {
          type: 'collection',
          id: virtualCollectionId(collectionEntry1.id, 'Related'),
        },
        owner: collectionEntry1.id,
        ownerKey: viewMetadataKey(layoutId, 'Related'),
        name: 'Related',
      });
    });
  });

  afterEach(() => {
    cleanupRecordingTestSqlDatabase();
    cleanup();
  });

  it('does nothing to collections if the database has no collection properties', async () => {
    // Rename a database without collection properties
    await onRenameDatabase({
      original: objectDatabase,
      updated: {
        ...objectDatabase,
        name: 'Renamed Objects',
      },
    });

    // The unrelated virtual collection should be unchanged
    const related = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    expect(related!.name).toBe(
      virtualCollectionName(
        collectionDatabase.name,
        collectionEntry1.title,
        'Related',
      ),
    );
  });

  it('updates entries in place with the new path and database', async () => {
    await onRenameDatabase({
      original: collectionDatabase,
      updated: renamedDatabase,
    });

    // The entry should carry the swapped path and database
    const renamed = DatabaseEntriesStore.get(collectionEntry1.id);
    expect(renamed).toMatchObject({
      id: collectionEntry1.id,
      path: renamedEntryPath,
      database: renamedDatabase.id,
    });
  });

  it('upserts the database and entries in SQL', async () => {
    await onRenameDatabase({
      original: collectionDatabase,
      updated: renamedDatabase,
    });

    // Database record upserted with the new name and path
    expect(sqlGetAllDatabases()).toContainEqual({
      id: renamedDatabase.id,
      name: renamedDatabase.name,
      path: renamedDatabase.path,
      icon: renamedDatabase.icon,
    });

    // Entry records re-upserted under the new database ID
    expect(sqlGetEntrySyncRecords(renamedDatabase.id)).toContainEqual(
      expect.objectContaining({
        id: collectionEntry1.id,
        path: renamedEntryPath,
      }),
    );
  });

  it('does not dispatch a database delete sync event', async () => {
    const deleteEvents: DatabaseSqlSyncedEventData[] = [];

    // Capture database delete sync events
    Events.addListener(DatabaseSqlSyncedEvent, 'test', (data) => {
      if (data.action === 'delete') {
        deleteEvents.push(data);
      }
    });

    await onRenameDatabase({
      original: collectionDatabase,
      updated: renamedDatabase,
    });

    // The database ID is unchanged, so no delete is needed
    expect(deleteEvents).toEqual([]);
  });

  it('does not dispatch a delete sync event for the entries', async () => {
    const deleteEvents: DatabaseEntriesSqlSyncedEventData[] = [];

    // Capture entry delete sync events
    Events.addListener(DatabaseEntriesSqlSyncedEvent, 'test', (data) => {
      if (data.action === 'delete') {
        deleteEvents.push(data);
      }
    });

    await onRenameDatabase({
      original: collectionDatabase,
      updated: renamedDatabase,
    });

    // Entry IDs are unchanged, so a delete event would remove the
    // re-upserted records
    expect(deleteEvents).toEqual([]);
  });

  it('updates virtual collection names to the new database name', async () => {
    // Point the Related collection at an in-database member plus an
    // external reference
    await Collections.update(
      virtualCollectionId(collectionEntry1.id, 'Related'),
      { items: [collectionEntry1.id, 'external-entry'] },
    );

    await onRenameDatabase({
      original: collectionDatabase,
      updated: renamedDatabase,
    });

    // The collection exists under its unchanged ID with the new name
    const related = Collections.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );

    expect(related.name).toBe(
      virtualCollectionName(
        renamedDatabase.name,
        collectionEntry1.title,
        'Related',
      ),
    );
    // Member entries are untouched
    expect(related.items).toEqual([collectionEntry1.id, 'external-entry']);
  });

  it('leaves virtual views untouched', async () => {
    const layoutId = layout_card_2.id;

    await onRenameDatabase({
      original: collectionDatabase,
      updated: renamedDatabase,
    });

    // The view should still exist unchanged
    const view = DataViews.get(
      virtualViewId(collectionEntry1.id, layoutId, 'Related'),
    );

    expect(view.dataSource).toEqual({
      type: 'collection',
      id: virtualCollectionId(collectionEntry1.id, 'Related'),
    });
  });

  it("rewrites referencing entries' files with the new addresses", async () => {
    const renamedRoot = {
      ...rootStorageDatabase,
      name: 'Renamed Root',
      path: `${parentDir}/Renamed Root`,
    };

    // Commit the rename to the store, as renameDatabase does before
    // dispatching, so re-serialized references name the new database
    DatabasesStore.set(renamedRoot);

    // Rename the database containing referenceEntry1, which is
    // referenced by collectionEntry1's References property
    await onRenameDatabase({
      original: rootStorageDatabase,
      updated: renamedRoot,
    });

    const contents = MockFs.readTextFile(collectionEntry1.path);

    // The referencing file should contain the new address
    expect(contents).toContain('Renamed Root/Reference Entry 1');
  });

  it('does not upsert entries when the database has no entries', async () => {
    // noPropertiesDatabase has no entries loaded in the store
    await onRenameDatabase({
      original: noPropertiesDatabase,
      updated: { ...noPropertiesDatabase, name: 'Renamed' },
    });

    // The database record is still re-synced
    expect(sqlGetAllDatabases()).toContainEqual(
      expect.objectContaining({ id: noPropertiesDatabase.id }),
    );

    // No entry upsert statements should have been executed
    const entryUpserts = getRecordedSqlStatements().filter((statement) =>
      statement.sql.includes('INSERT OR REPLACE INTO entries'),
    );

    expect(entryUpserts).toEqual([]);
  });
});
