import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import {
  cleanup,
  collectionDatabase,
  collectionEntry1,
  relatedEntry1,
  relatedEntry2,
  setup,
} from '../test-utils';
import { virtualCollectionId, virtualCollectionName } from '../utils';
import { removeEntriesFromCollections } from './removeEntriesFromCollections';

// The virtual collection owned by collectionEntry1's Related property
const relatedCollectionId = virtualCollectionId(collectionEntry1.id, 'Related');

const { workspace_2 } = WorkspaceFixtures;

describe('removeEntriesFromCollections', () => {
  beforeEach(() => {
    setup();

    // Create a virtual collection containing the related entries
    Collections.createVirtual(
      relatedCollectionId,
      virtualCollectionName(
        collectionDatabase.name,
        collectionEntry1.title,
        'Related',
      ),
      collectionEntry1.properties.Related as string[],
    );
  });

  afterEach(cleanup);

  it('removes the entries from collections containing them', async () => {
    await removeEntriesFromCollections([relatedEntry1.id]);

    const collection = Collections.get(relatedCollectionId);

    expect(collection.items).toEqual([relatedEntry2.id]);
  });

  it('removes multiple entries in a single update', async () => {
    await removeEntriesFromCollections([relatedEntry1.id, relatedEntry2.id]);

    const collection = Collections.get(relatedCollectionId);

    expect(collection.items).toEqual([]);
  });

  it('leaves unrelated collections untouched', async () => {
    const before = Collections.get(relatedCollectionId);

    await removeEntriesFromCollections(['unreferenced-entry']);

    expect(Collections.get(relatedCollectionId)).toEqual(before);
  });

  it("removes the entries from the given workspace's collections", async () => {
    const collection = Collections.get(relatedCollectionId);

    // The collection held by the second workspace as well
    Collections.Store.in(workspace_2.id).set(collection);

    await removeEntriesFromCollections([relatedEntry1.id], workspace_2.id);

    // Should update the second workspace's collection, leaving the
    // active workspace's as it was.
    expect(
      Collections.get(relatedCollectionId, true, workspace_2.id).items,
    ).toEqual([relatedEntry2.id]);
    expect(Collections.get(relatedCollectionId)).toEqual(collection);
  });
});
