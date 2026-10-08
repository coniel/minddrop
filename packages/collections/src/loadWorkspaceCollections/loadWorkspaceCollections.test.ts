import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { ItemReferences } from '@minddrop/item-references';
import { storeItem } from '@minddrop/stores/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { CollectionsStore } from '../CollectionsStore';
import { addCollectionItems } from '../addCollectionItems';
import { CollectionsLoadedEvent } from '../events';
import {
  MockFs,
  cleanup,
  collection_3,
  collections,
  setup,
} from '../test-utils';
import { Collection } from '../types';
import { resolveCollectionFilePath, resolveCollectionsDirPath } from '../utils';
import { loadWorkspaceCollections } from './loadWorkspaceCollections';

const { workspace_1, workspace_2 } = WorkspaceFixtures;

describe('loadWorkspaceCollections', () => {
  beforeEach(() =>
    setup({ loadCollections: false, loadVirtualCollections: false }),
  );

  afterEach(cleanup);

  it('creates the collections directory if it does not exist', async () => {
    // Remove the collections directory
    MockFs.removeFile(resolveCollectionsDirPath());

    await loadWorkspaceCollections(workspace_1);

    expect(MockFs.exists(resolveCollectionsDirPath())).toBe(true);
  });

  it('loads collections from the collections directory into the store', async () => {
    await loadWorkspaceCollections(workspace_1);

    expect(CollectionsStore).toHaveItems(collections);
  });

  it("loads collections into the workspace's store record", async () => {
    const [collection] = collections;

    // Give the second workspace a collection of its own
    MockFs.addFiles([
      {
        path: resolveCollectionFilePath(collection.id, workspace_2.path),
        textContent: JSON.stringify(collection),
      },
    ]);

    await loadWorkspaceCollections(workspace_2);

    // Should load into the second workspace's record, not the
    // active workspace's.
    expect(CollectionsStore.in(workspace_2.id).get(collection.id)).toEqual(
      collection,
    );
    expect(CollectionsStore).not.toHaveItem(collection.id);
  });

  it('filters out null collections', async () => {
    // Create an invalid collection file
    MockFs.writeTextFile(
      resolveCollectionFilePath('invalid-collection'),
      'invalid json',
    );

    await loadWorkspaceCollections(workspace_1);

    expect(CollectionsStore).toHaveItems(collections);
  });

  it('dispatches a collections loaded event', async () =>
    new Promise<void>((done) => {
      Events.addListener(CollectionsLoadedEvent, 'test', (payload) => {
        expect(payload).toEqual(collections);
        done();
      });

      loadWorkspaceCollections(workspace_1);
    }));

  it('resolves item references in the loaded workspace', async () => {
    // Register an adapter that prefixes resolved IDs with the
    // workspace they were resolved in.
    ItemReferences.registerAdapter({
      type: 'database-entry',
      serialize: (id) => id,
      match: (reference, workspaceId) => ({
        type: 'database-entry',
        id: `${workspaceId}:${reference}`,
      }),
    });

    await loadWorkspaceCollections(workspace_1);

    const [firstCollection] = collections;
    const loaded = storeItem(CollectionsStore, firstCollection.id);

    // The loaded items should be resolved item IDs
    expect(loaded.items).toEqual(
      firstCollection.items.map((id) => `${workspace_1.id}:${id}`),
    );
  });

  // Pins Issue 28: Collections permanently drop member references whose
  // item is not loaded when the collections load. Remove .fails once
  // fixed.
  it.fails(
    'keeps a member whose item is not yet loaded when the collection is next written',
    async () => {
      const [collection] = collections;
      const [loadedItemId, pendingItemId] = collection.items;
      // The item IDs that resolve. The pending item is not loaded yet.
      const loadedEntryIds = new Set([loadedItemId]);

      // Resolve references only to loaded items. Others match as valid
      // addresses with no item yet.
      ItemReferences.registerAdapter({
        type: 'database-entry',
        serialize: (id) => id,
        match: (reference) => ({
          type: 'database-entry',
          id: loadedEntryIds.has(reference) ? reference : null,
        }),
      });

      await loadWorkspaceCollections(workspace_1);

      // Load the pending item after the collections
      loadedEntryIds.add(pendingItemId);

      // Write the collection by adding an unrelated item to it
      await addCollectionItems(collection.id, [collection_3.items[0]]);

      const written = MockFs.readJsonFile<Collection>(
        resolveCollectionFilePath(collection.id),
      );

      expect(written.items).toContain(pendingItemId);
    },
  );
});
