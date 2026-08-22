import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Collections } from '@minddrop/collections';
import { DataViews } from '@minddrop/data-views';
import { DesignFixtures } from '@minddrop/designs-legacy/test-utils';
import { Events } from '@minddrop/events';
import {
  ItemAddressesChangedEvent,
  ItemAddressesChangedEventData,
} from '@minddrop/item-references';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { sqlUpsertEntries } from '../../sql';
import {
  MockFs,
  cleanup,
  collectionDatabase,
  collectionEntry1,
  objectEntry1,
  relatedEntry1,
  setup,
} from '../../test-utils';
import { DatabaseEntryMetadata } from '../../types';
import {
  resolveEntryMetadataFilePath,
  virtualCollectionId,
  virtualCollectionName,
  virtualViewId,
} from '../../utils';
import { onItemAddressesChanged } from '../item-addresses-changed';
import { onRenameEntry } from './entry-renamed';

// Mock SQL operations since no database connection is available in tests
vi.mock('../../sql', () => ({
  sqlUpsertEntries: vi.fn(),
}));

const { layout_card_2 } = DesignFixtures;

// The renamed version of collectionEntry1: same ID, new title and path
const renamedEntry = {
  ...collectionEntry1,
  title: 'Renamed Entry',
  path: `${collectionDatabase.path}/Renamed Entry.md`,
};

// The entry's metadata sidecar before and after the rename
const oldSidecarPath = resolveEntryMetadataFilePath(
  collectionDatabase.path,
  collectionEntry1.path,
);
const newSidecarPath = resolveEntryMetadataFilePath(
  collectionDatabase.path,
  renamedEntry.path,
);

describe('onRenameEntry', () => {
  beforeEach(() => {
    setup();

    // Register the reference rewrite listener normally wired by
    // initializeDatabaseEventHandlers
    Events.on<ItemAddressesChangedEventData>(
      ItemAddressesChangedEvent,
      'test',
      ({ data }) => onItemAddressesChanged(data),
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

  afterEach(cleanup);

  it('does nothing if the database has no collection properties', async () => {
    // Call the handler with an entry from a database without collection properties
    await onRenameEntry({
      original: objectEntry1,
      updated: { ...objectEntry1, title: 'Renamed' },
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
      embeddedViewConfigs: { 'card:Related': { options: {}, data: {} } },
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
    });

    expect(sqlUpsertEntries).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining([
        expect.objectContaining({
          id: objectEntry1.id,
          title: 'Renamed',
        }),
      ]),
    );
  });

  it('updates virtual collection names to the new entry title', async () => {
    // Update the store to reflect the rename
    DatabaseEntriesStore.set(renamedEntry);

    await onRenameEntry({
      original: collectionEntry1,
      updated: renamedEntry,
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

  it('leaves virtual views untouched', async () => {
    const layoutId = layout_card_2.id;
    const viewId = virtualViewId(collectionEntry1.id, 'Related', layoutId);
    const dataSource = {
      type: 'collection' as const,
      id: virtualCollectionId(collectionEntry1.id, 'Related'),
    };

    // Create a virtual view for a collection property
    DataViews.createVirtual({
      id: viewId,
      type: 'board',
      dataSource,
      name: 'Related',
    });

    // Update the store to reflect the rename
    DatabaseEntriesStore.set(renamedEntry);

    await onRenameEntry({
      original: collectionEntry1,
      updated: renamedEntry,
    });

    // The view should still exist unchanged
    const view = DataViews.get(viewId);

    expect(view.dataSource).toEqual(dataSource);
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
    });

    const contents = MockFs.readTextFile(collectionEntry1.path);

    // The referencing file should contain the new address
    expect(contents).toContain('Collection Database/Renamed Related.md');
  });

  it('handles entries without collection properties', async () => {
    // objectEntry1 is in objectDatabase which has no collection properties
    await onRenameEntry({
      original: objectEntry1,
      updated: { ...objectEntry1, title: 'Renamed' },
    });

    // Should complete without error, collections should be untouched
    expect(
      Collections.Store.get(
        virtualCollectionId(collectionEntry1.id, 'Related'),
      ),
    ).not.toBeNull();
  });
});
