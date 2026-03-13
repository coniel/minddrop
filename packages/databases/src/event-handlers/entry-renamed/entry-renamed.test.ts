import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Collections } from '@minddrop/collections';
import { DesignFixtures } from '@minddrop/designs';
import { Views } from '@minddrop/views';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { sqlDeleteEntries, sqlUpsertEntries } from '../../sql';
import {
  MockFs,
  cleanup,
  collectionDatabase,
  collectionEntry1,
  objectEntry1,
  setup,
} from '../../test-utils';
import { DatabaseEntryMetadata } from '../../types';
import { updateEntryMetadata } from '../../updateEntryMetadata';
import {
  databaseMetadataFilePath,
  virtualCollectionId,
  virtualCollectionName,
  virtualViewId,
} from '../../utils';
import { onRenameEntry } from './entry-renamed';

// Mock SQL operations since no database connection is available in tests
vi.mock('../../sql', () => ({
  sqlDeleteEntries: vi.fn(),
  sqlUpsertEntries: vi.fn(),
}));

const { design_card_2 } = DesignFixtures;

describe('onRenameEntry', () => {
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

  it('re-keys metadata file from old to new entry ID', async () => {
    const metadataFilePath = databaseMetadataFilePath(collectionDatabase.path);
    const entryMetadata: DatabaseEntryMetadata = {
      views: { 'card:Related': { options: {}, data: {} } },
    };

    // Write metadata keyed by the original entry ID
    MockFs.addFiles([
      {
        path: metadataFilePath,
        textContent: JSON.stringify({
          [collectionEntry1.id]: entryMetadata,
        }),
      },
    ]);

    const renamedEntry = {
      ...collectionEntry1,
      id: `${collectionDatabase.name}/Renamed Entry.md`,
      title: 'Renamed Entry',
      path: `${collectionDatabase.path}/Renamed Entry.md`,
    };

    // Update the store so getDatabase can find the entry
    DatabaseEntriesStore.set(renamedEntry);

    await onRenameEntry({
      original: collectionEntry1,
      updated: renamedEntry,
    });

    // Metadata should be re-keyed to the new entry ID
    const written = JSON.parse(MockFs.readTextFile(metadataFilePath));

    expect(written[renamedEntry.id]).toEqual(entryMetadata);
    expect(written[collectionEntry1.id]).toBeUndefined();
  });

  it('re-keys pending metadata from old to new entry ID', async () => {
    const metadataFilePath = databaseMetadataFilePath(collectionDatabase.path);
    const entryMetadata: DatabaseEntryMetadata = {
      views: { 'card:Related': { options: { foo: true }, data: {} } },
    };

    // Queue pending metadata under the original entry ID
    updateEntryMetadata(collectionEntry1.id, entryMetadata);

    const renamedEntry = {
      ...collectionEntry1,
      id: `${collectionDatabase.name}/Renamed Entry.md`,
      title: 'Renamed Entry',
      path: `${collectionDatabase.path}/Renamed Entry.md`,
    };

    // Update the store
    DatabaseEntriesStore.set(renamedEntry);

    // onRenameEntry flushes first, then re-keys pending
    await onRenameEntry({
      original: collectionEntry1,
      updated: renamedEntry,
    });

    // The flushed metadata should be written under the new key
    const written = JSON.parse(MockFs.readTextFile(metadataFilePath));

    expect(written[renamedEntry.id]).toEqual(entryMetadata);
    expect(written[collectionEntry1.id]).toBeUndefined();
  });

  it('deletes old SQL entry record via sqlDeleteEntries', async () => {
    await onRenameEntry({
      original: objectEntry1,
      updated: { ...objectEntry1, title: 'Renamed' },
    });

    expect(sqlDeleteEntries).toHaveBeenCalledWith(expect.any(String), [
      objectEntry1.id,
    ]);
  });

  it('upserts new SQL entry record via sqlUpsertEntries', async () => {
    const renamedEntry = { ...objectEntry1, title: 'Renamed' };

    await onRenameEntry({
      original: objectEntry1,
      updated: renamedEntry,
    });

    // Should have been called with databaseId and a record matching
    // the renamed entry
    expect(sqlUpsertEntries).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining([
        expect.objectContaining({
          id: renamedEntry.id,
          title: 'Renamed',
        }),
      ]),
    );
  });

  it('re-IDs virtual collections to use the new entry ID', async () => {
    const renamedEntry = {
      ...collectionEntry1,
      id: `${collectionDatabase.name}/Renamed Entry.md`,
      title: 'Renamed Entry',
      path: `${collectionDatabase.path}/Renamed Entry.md`,
    };

    // Update the store
    DatabaseEntriesStore.set(renamedEntry);

    await onRenameEntry({
      original: collectionEntry1,
      updated: renamedEntry,
    });

    // Old collection IDs should be gone
    expect(
      Collections.Store.get(
        virtualCollectionId(collectionEntry1.id, 'Related'),
      ),
    ).toBeNull();
    expect(
      Collections.Store.get(
        virtualCollectionId(collectionEntry1.id, 'References'),
      ),
    ).toBeNull();

    // New collection IDs should exist with correct names
    const relatedCollection = Collections.get(
      virtualCollectionId(renamedEntry.id, 'Related'),
    );
    const referencesCollection = Collections.get(
      virtualCollectionId(renamedEntry.id, 'References'),
    );

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

  it('re-IDs virtual views with updated dataSource', async () => {
    const designId = design_card_2.id;

    // Create virtual views for each collection property
    Views.createVirtual({
      id: virtualViewId(collectionEntry1.id, 'Related', designId),
      type: 'board',
      dataSource: {
        type: 'collection',
        id: virtualCollectionId(collectionEntry1.id, 'Related'),
      },
      name: 'Related',
    });
    Views.createVirtual({
      id: virtualViewId(collectionEntry1.id, 'References', designId),
      type: 'board',
      dataSource: {
        type: 'collection',
        id: virtualCollectionId(collectionEntry1.id, 'References'),
      },
      name: 'References',
    });

    const renamedEntry = {
      ...collectionEntry1,
      id: `${collectionDatabase.name}/Renamed Entry.md`,
      title: 'Renamed Entry',
      path: `${collectionDatabase.path}/Renamed Entry.md`,
    };

    // Update the store
    DatabaseEntriesStore.set(renamedEntry);

    await onRenameEntry({
      original: collectionEntry1,
      updated: renamedEntry,
    });

    // Old view IDs should be gone
    expect(
      Views.Store.get(virtualViewId(collectionEntry1.id, 'Related', designId)),
    ).toBeNull();

    // New view IDs should exist with updated dataSource
    const relatedView = Views.get(
      virtualViewId(renamedEntry.id, 'Related', designId),
    );

    expect(relatedView.dataSource).toEqual({
      type: 'collection',
      id: virtualCollectionId(renamedEntry.id, 'Related'),
    });
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
