import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataViews } from '@minddrop/data-views';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { sqlGetEntrySyncRecords, sqlUpsertDatabase } from '../../sql';
import {
  MockFs,
  cleanup,
  cleanupRecordingTestSqlDatabase,
  clearRecordedSqlStatements,
  collectionDatabase,
  collectionEntry1,
  getRecordedSqlStatements,
  relatedEntry1,
  setup,
  setupRecordingTestSqlDatabase,
} from '../../test-utils';
import {
  databaseEntryAddress,
  viewMetadataKey,
  virtualViewId,
} from '../../utils';
import { onItemAddressesChanged } from './item-addresses-changed';

const { dataViewType_referencing } = DataViewFixtures;

describe('onItemAddressesChanged', () => {
  beforeEach(() => {
    setup();

    // Open a recording in-memory SQL database
    setupRecordingTestSqlDatabase();

    // Seed the database record the changed entries belong to
    sqlUpsertDatabase(
      {
        id: collectionDatabase.id,
        name: collectionDatabase.name,
        path: collectionDatabase.path,
        icon: collectionDatabase.icon,
      },
      { silent: true },
    );

    // Drop the seeding statements so tests only see the handler's SQL
    clearRecordedSqlStatements();
  });

  afterEach(() => {
    cleanupRecordingTestSqlDatabase();
    cleanup();
  });

  it("upserts the changed entries' SQL records", async () => {
    const renamedPath = `${collectionDatabase.path}/Renamed Related.md`;

    // Simulate a rename of an entry
    DatabaseEntriesStore.update(relatedEntry1.id, {
      title: 'Renamed Related',
      path: renamedPath,
    });

    await onItemAddressesChanged([
      {
        id: relatedEntry1.id,
        oldReference: databaseEntryAddress(relatedEntry1.path),
        newReference: databaseEntryAddress(renamedPath),
      },
    ]);

    // The entry's SQL record should carry the new path
    expect(sqlGetEntrySyncRecords(collectionDatabase.id)).toContainEqual(
      expect.objectContaining({
        id: relatedEntry1.id,
        path: renamedPath,
      }),
    );
  });

  it("rewrites referencing entries' files with current addresses", async () => {
    // Simulate a rename of a referenced entry
    DatabaseEntriesStore.update(relatedEntry1.id, {
      title: 'Renamed Related',
      path: `${collectionDatabase.path}/Renamed Related.md`,
    });

    await onItemAddressesChanged([
      {
        id: relatedEntry1.id,
        oldReference: databaseEntryAddress(relatedEntry1.path),
        newReference: databaseEntryAddress(
          `${collectionDatabase.path}/Renamed Related.md`,
        ),
      },
    ]);

    const contents = MockFs.readTextFile(collectionEntry1.path);

    // The referencing file should contain the new address
    expect(contents).toContain('Collection Database/Renamed Related.md');
    expect(contents).not.toContain('Collection Database/Related Entry 1.md');
  });

  it('re-persists embedded view configs referencing changed items', async () => {
    const renamedPath = `${collectionDatabase.path}/Renamed Related.md`;

    // An embedded virtual view referencing the renamed entry
    DataViews.createVirtual({
      id: virtualViewId(collectionEntry1.id, 'layout-1', 'Related'),
      type: dataViewType_referencing.type,
      dataSource: { type: 'collection', id: 'collection-1' },
      owner: collectionEntry1.id,
      ownerKey: viewMetadataKey('layout-1', 'Related'),
      name: 'Related',
      data: { items: [relatedEntry1.id] },
    });

    // Simulate a rename of the referenced entry
    DatabaseEntriesStore.update(relatedEntry1.id, {
      title: 'Renamed Related',
      path: renamedPath,
    });

    await onItemAddressesChanged([
      {
        id: relatedEntry1.id,
        oldReference: databaseEntryAddress(relatedEntry1.path),
        newReference: databaseEntryAddress(renamedPath),
      },
    ]);

    const entry = DatabaseEntriesStore.get(collectionEntry1.id)!;

    // The embedded config holds the entry's new durable address
    expect(
      entry.metadata.embeddedViewConfigs?.[
        viewMetadataKey('layout-1', 'Related')
      ],
    ).toEqual({
      options: dataViewType_referencing.defaultOptions,
      data: { items: [databaseEntryAddress(renamedPath)] },
    });
  });

  it('does nothing for unreferenced items', async () => {
    const before = MockFs.readTextFile(collectionEntry1.path);

    await onItemAddressesChanged([
      {
        id: 'database-entry_unreferenced',
        oldReference: 'old',
        newReference: 'new',
      },
    ]);

    expect(MockFs.readTextFile(collectionEntry1.path)).toBe(before);

    // No entry upsert statements should have been executed
    const entryUpserts = getRecordedSqlStatements().filter((statement) =>
      statement.sql.includes('INSERT OR REPLACE INTO entries'),
    );

    expect(entryUpserts).toEqual([]);
  });
});
