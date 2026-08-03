import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Collections } from '@minddrop/collections';
import { DesignFixtures } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { DataViews } from '@minddrop/views';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import {
  DatabaseEntriesSqlSyncedEvent,
  DatabaseEntriesSqlSyncedEventData,
  DatabaseSqlSyncedEvent,
  DatabaseSqlSyncedEventData,
} from '../../events';
import {
  sqlDeleteDatabase,
  sqlUpsertDatabase,
  sqlUpsertEntries,
} from '../../sql';
import {
  cleanup,
  collectionDatabase,
  collectionEntry1,
  noPropertiesDatabase,
  objectDatabase,
  parentDir,
  setup,
} from '../../test-utils';
import {
  virtualCollectionId,
  virtualCollectionName,
  virtualViewId,
} from '../../utils';
import { onRenameDatabase } from './database-renamed';

// Mock SQL operations since no database connection is available in tests
vi.mock('../../sql', () => ({
  sqlDeleteDatabase: vi.fn(),
  sqlUpsertDatabase: vi.fn(),
  sqlUpsertEntries: vi.fn(),
}));

const { layout_card_2, layout_card_3 } = DesignFixtures;

// The collection database renamed to a new name/ID
const renamedDatabase = {
  ...collectionDatabase,
  id: 'Renamed Database',
  name: 'Renamed Database',
  path: `${parentDir}/Renamed Database`,
};

// The expected new ID and path for collectionEntry1 after the rename
const renamedEntryId = 'Renamed Database/Collection Entry 1.md';
const renamedEntryPath = `${parentDir}/Renamed Database/Collection Entry 1.md`;

describe('onRenameDatabase', () => {
  beforeEach(() => {
    setup();

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
        id: virtualViewId(collectionEntry1.id, 'Related', layoutId),
        type: 'board',
        dataSource: {
          type: 'collection',
          id: virtualCollectionId(collectionEntry1.id, 'Related'),
        },
        name: 'Related',
      });
    });
  });

  afterEach(cleanup);

  it('does nothing to collections if the database has no collection properties', async () => {
    // Rename a database without collection properties
    await onRenameDatabase({
      original: objectDatabase,
      updated: {
        ...objectDatabase,
        id: 'Renamed Objects',
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

  it('swaps entries in the frontend store from old to new IDs', async () => {
    await onRenameDatabase({
      original: collectionDatabase,
      updated: renamedDatabase,
    });

    // The old entry key should be gone
    expect(DatabaseEntriesStore.get(collectionEntry1.id)).toBeNull();

    // The new entry should carry the swapped ID, path, and database
    const renamed = DatabaseEntriesStore.get(renamedEntryId);
    expect(renamed).toMatchObject({
      id: renamedEntryId,
      path: renamedEntryPath,
      database: renamedDatabase.id,
    });
  });

  it('deletes the old database, upserts the new one, and re-upserts entries in SQL', async () => {
    await onRenameDatabase({
      original: collectionDatabase,
      updated: renamedDatabase,
    });

    // Old database record deleted silently so CASCADE does not emit events
    expect(sqlDeleteDatabase).toHaveBeenCalledWith(collectionDatabase.id, {
      silent: true,
    });

    // Renamed database upserted under the new ID
    expect(sqlUpsertDatabase).toHaveBeenCalledWith({
      id: renamedDatabase.id,
      name: renamedDatabase.name,
      path: renamedDatabase.path,
      icon: renamedDatabase.icon,
    });

    // Entries re-upserted under the new database ID with the new entry ID
    expect(sqlUpsertEntries).toHaveBeenCalledWith(
      renamedDatabase.id,
      expect.arrayContaining([expect.objectContaining({ id: renamedEntryId })]),
    );
  });

  it('dispatches a delete sync event for the old database ID', async () => {
    const deleteEvents: DatabaseSqlSyncedEventData[] = [];

    // Capture database delete sync events so we can assert search is told
    // to drop the old database record
    Events.addListener<DatabaseSqlSyncedEventData>(
      DatabaseSqlSyncedEvent,
      'test',
      ({ data }) => {
        if (data.action === 'delete') {
          deleteEvents.push(data);
        }
      },
    );

    await onRenameDatabase({
      original: collectionDatabase,
      updated: renamedDatabase,
    });

    // A delete event should carry the old database ID
    expect(deleteEvents).toEqual([
      { action: 'delete', databaseId: collectionDatabase.id },
    ]);
  });

  it('dispatches a delete sync event for the old entry IDs', async () => {
    const deleteEvents: DatabaseEntriesSqlSyncedEventData[] = [];

    // Capture delete sync events so we can assert on the orphan cleanup
    Events.addListener<DatabaseEntriesSqlSyncedEventData>(
      DatabaseEntriesSqlSyncedEvent,
      'test',
      ({ data }) => {
        if (data.action === 'delete') {
          deleteEvents.push(data);
        }
      },
    );

    await onRenameDatabase({
      original: collectionDatabase,
      updated: renamedDatabase,
    });

    // A delete event should carry the old entry IDs under the old database ID
    expect(deleteEvents).toEqual([
      {
        action: 'delete',
        entryIds: [collectionEntry1.id],
        databaseId: collectionDatabase.id,
      },
    ]);
  });

  it('re-IDs virtual collections, remapping members and the name', async () => {
    // Point the Related collection at an in-database member plus an
    // external reference to exercise member remapping
    await Collections.update(
      virtualCollectionId(collectionEntry1.id, 'Related'),
      { entries: [collectionEntry1.id, 'external-entry'] },
    );

    await onRenameDatabase({
      original: collectionDatabase,
      updated: renamedDatabase,
    });

    // Old collection IDs should be gone
    expect(
      Collections.Store.get(
        virtualCollectionId(collectionEntry1.id, 'Related'),
      ),
    ).toBeNull();

    // New collection exists with the remapped name and members
    const related = Collections.get(
      virtualCollectionId(renamedEntryId, 'Related'),
    );

    expect(related.name).toBe(
      virtualCollectionName(
        renamedDatabase.name,
        collectionEntry1.title,
        'Related',
      ),
    );
    // The in-database member is remapped, the external reference is kept
    expect(related.entries).toEqual([renamedEntryId, 'external-entry']);
  });

  it('re-IDs virtual views with an updated dataSource', async () => {
    const layoutId = layout_card_2.id;

    await onRenameDatabase({
      original: collectionDatabase,
      updated: renamedDatabase,
    });

    // Old view ID should be gone
    expect(
      DataViews.Store.get(
        virtualViewId(collectionEntry1.id, 'Related', layoutId),
      ),
    ).toBeNull();

    // New view exists pointing at the new collection
    const view = DataViews.get(
      virtualViewId(renamedEntryId, 'Related', layoutId),
    );

    expect(view.dataSource).toEqual({
      type: 'collection',
      id: virtualCollectionId(renamedEntryId, 'Related'),
    });
  });

  it('reloads the database browse views under the new database ID', async () => {
    // A database with a browse view stored on its config
    const original = {
      ...noPropertiesDatabase,
      views: [
        {
          id: 'table-view',
          type: 'table',
          name: 'Table',
          icon: 'content-icon:table:default',
          created: new Date(),
          lastModified: new Date(),
        },
      ],
    };
    const updated = {
      ...original,
      id: 'Renamed',
      name: 'Renamed',
      path: `${parentDir}/Renamed`,
    };

    await onRenameDatabase({ original, updated });

    // The browse view is loaded pointing at the new database ID
    const views = DataViews.getByDataSource('database', updated.id);
    expect(views).toHaveLength(1);
    expect(views[0]).toMatchObject({
      id: 'table-view',
      dataSource: { type: 'database', id: updated.id },
    });
  });

  it('does not upsert entries when the database has no entries', async () => {
    // noPropertiesDatabase has no entries loaded in the store
    await onRenameDatabase({
      original: noPropertiesDatabase,
      updated: { ...noPropertiesDatabase, id: 'Renamed', name: 'Renamed' },
    });

    // The database is still re-synced, but no entry upsert occurs
    expect(sqlUpsertDatabase).toHaveBeenCalled();
    expect(sqlUpsertEntries).not.toHaveBeenCalled();
  });
});
