import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { ItemReferences } from '@minddrop/item-references';
import { storeItem } from '@minddrop/stores/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionsLoadedEvent } from '../events';
import { MockFs, cleanup, collections, setup } from '../test-utils';
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
});
