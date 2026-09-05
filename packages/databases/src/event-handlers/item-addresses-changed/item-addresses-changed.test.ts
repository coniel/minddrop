import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataViews } from '@minddrop/data-views';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { History } from '@minddrop/history';
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
  relatedEntry2,
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

// The renamed state of relatedEntry1, used as the change's new address
const renamedRelated = {
  ...relatedEntry1,
  title: 'Renamed Related',
  path: `${collectionDatabase.path}/Renamed Related.md`,
};

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
    // Simulate a rename of an entry
    DatabaseEntriesStore.update(relatedEntry1.id, {
      title: renamedRelated.title,
      path: renamedRelated.path,
    });

    await onItemAddressesChanged([
      {
        id: relatedEntry1.id,
        oldReference: databaseEntryAddress(relatedEntry1, collectionDatabase),
        newReference: databaseEntryAddress(renamedRelated, collectionDatabase),
      },
    ]);

    // The entry's SQL record should carry the new path
    expect(sqlGetEntrySyncRecords(collectionDatabase.id)).toContainEqual(
      expect.objectContaining({
        id: relatedEntry1.id,
        path: renamedRelated.path,
      }),
    );
  });

  it("rewrites referencing entries' files with current addresses", async () => {
    // Simulate a rename of a referenced entry
    DatabaseEntriesStore.update(relatedEntry1.id, {
      title: renamedRelated.title,
      path: renamedRelated.path,
    });

    await onItemAddressesChanged([
      {
        id: relatedEntry1.id,
        oldReference: databaseEntryAddress(relatedEntry1, collectionDatabase),
        newReference: databaseEntryAddress(renamedRelated, collectionDatabase),
      },
    ]);

    const contents = MockFs.readTextFile(collectionEntry1.path);

    // The referencing file should contain the new address
    expect(contents).toContain('Collection Database/Renamed Related');
    expect(contents).not.toContain('Collection Database/Related Entry 1');
  });

  it('re-persists embedded view configs referencing changed items', async () => {
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
      title: renamedRelated.title,
      path: renamedRelated.path,
    });

    await onItemAddressesChanged([
      {
        id: relatedEntry1.id,
        oldReference: databaseEntryAddress(relatedEntry1, collectionDatabase),
        newReference: databaseEntryAddress(renamedRelated, collectionDatabase),
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
      data: {
        items: [databaseEntryAddress(renamedRelated, collectionDatabase)],
      },
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

  it('records the change against entries which reference it', async () => {
    // Simulate a rename of a referenced entry
    DatabaseEntriesStore.update(relatedEntry1.id, {
      title: renamedRelated.title,
      path: renamedRelated.path,
    });

    await onItemAddressesChanged([
      {
        id: relatedEntry1.id,
        oldReference: databaseEntryAddress(relatedEntry1, collectionDatabase),
        newReference: databaseEntryAddress(renamedRelated, collectionDatabase),
      },
    ]);

    // The referencing entry's history should be able to follow its
    // older records to the new address.
    expect(
      await History.read({
        ownerPath: collectionDatabase.path,
        subjectKey: collectionEntry1.title,
      }),
    ).toContainEqual(
      expect.objectContaining({
        kind: 'rename',
        target: 'reference',
        from: databaseEntryAddress(relatedEntry1, collectionDatabase),
        to: databaseEntryAddress(renamedRelated, collectionDatabase),
      }),
    );
  });

  it('records nothing against entries which do not reference it', async () => {
    DatabaseEntriesStore.update(relatedEntry1.id, {
      title: renamedRelated.title,
      path: renamedRelated.path,
    });

    await onItemAddressesChanged([
      {
        id: relatedEntry1.id,
        oldReference: databaseEntryAddress(relatedEntry1, collectionDatabase),
        newReference: databaseEntryAddress(renamedRelated, collectionDatabase),
      },
    ]);

    // relatedEntry2 is in the same database but references nothing
    expect(
      await History.read({
        ownerPath: collectionDatabase.path,
        subjectKey: relatedEntry2.title,
      }),
    ).toEqual([]);
  });
});
