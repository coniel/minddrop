import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { EntriesStore } from '../EntriesStore';
import {
  cleanup,
  collectionDatabase,
  collectionEntry1,
  databases,
  entries,
  setup,
} from '../test-utils';
import { virtualCollectionId, virtualCollectionName } from '../utils';
import { loadEntries } from './loadEntries';

const { workspace_1, workspace_2 } = WorkspaceFixtures;

describe('loadEntries', () => {
  beforeEach(() => setup({ loadEntries: false }));

  afterEach(cleanup);

  it('loads database entries into the store', () => {
    loadEntries(databases, entries, workspace_1.id);

    // Should load all entries into the store
    expect(EntriesStore).toHaveItems(entries);
  });

  it("loads the entries into the workspace's store record", () => {
    loadEntries(databases, entries, workspace_2.id);

    // Should load into the second workspace's records, not the
    // active workspace's.
    expect(EntriesStore.in(workspace_2.id).get(collectionEntry1.id)).toEqual(
      collectionEntry1,
    );
    expect(EntriesStore).not.toHaveItem(collectionEntry1.id);
    expect(
      Collections.Store.in(workspace_2.id).get(
        virtualCollectionId(collectionEntry1.id, 'Related'),
      ),
    ).not.toBeNull();
  });

  it('hydrates virtual collections from entries with collection properties', () => {
    loadEntries(databases, entries, workspace_1.id);

    // Should create virtual collections for each collection property
    const relatedCollection = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'Related'),
    );
    const referencesCollection = Collections.Store.get(
      virtualCollectionId(collectionEntry1.id, 'References'),
    );

    // Virtual collections should exist
    expect(relatedCollection).not.toBeNull();
    expect(referencesCollection).not.toBeNull();

    // Virtual collections should be marked as virtual
    expect(relatedCollection!.virtual).toBe(true);
    expect(referencesCollection!.virtual).toBe(true);

    // Virtual collections should have the correct names
    expect(relatedCollection!.name).toBe(
      virtualCollectionName(
        collectionDatabase.name,
        collectionEntry1.title,
        'Related',
      ),
    );
    expect(referencesCollection!.name).toBe(
      virtualCollectionName(
        collectionDatabase.name,
        collectionEntry1.title,
        'References',
      ),
    );

    // Virtual collections should have the correct entries
    expect(relatedCollection!.items).toEqual(
      collectionEntry1.properties.Related,
    );
    expect(referencesCollection!.items).toEqual(
      collectionEntry1.properties.References,
    );
  });

  it('does not create virtual collections for databases without collection properties', () => {
    loadEntries(databases, entries, workspace_1.id);

    // Should not create virtual collections for non-collection entries
    const allCollections = Collections.Store.getAllArray();
    const virtualCollections = allCollections.filter(
      (collection) => collection.virtual,
    );

    // Only the collection database's entries should produce virtual
    // collections (3 entries x 2 collection properties)
    expect(virtualCollections).toHaveLength(6);
  });
});
