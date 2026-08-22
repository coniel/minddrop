import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DataViews } from '@minddrop/data-views';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import {
  MockFs,
  cleanup,
  collectionDatabase,
  collectionEntry1,
  relatedEntry1,
  setup,
} from '../../test-utils';
import {
  databaseEntryAddress,
  viewMetadataKey,
  virtualViewId,
} from '../../utils';
import { onItemAddressesChanged } from './item-addresses-changed';

// Mock SQL operations since no database connection is available in tests
vi.mock('../../sql', () => ({
  sqlUpsertEntries: vi.fn(),
}));

const { dataViewType_referencing } = DataViewFixtures;

describe('onItemAddressesChanged', () => {
  beforeEach(setup);

  afterEach(cleanup);

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
      id: virtualViewId(collectionEntry1.id, 'Related', 'layout-1'),
      type: dataViewType_referencing.type,
      dataSource: { type: 'collection', id: 'collection-1' },
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
        viewMetadataKey('Related', 'layout-1')
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
  });
});
