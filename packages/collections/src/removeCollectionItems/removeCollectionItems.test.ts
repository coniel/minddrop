import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionUpdatedEvent } from '../events';
import { MockFs, cleanup, collection_1, mockDate, setup } from '../test-utils';
import { resolveCollectionFilePath } from '../utils';
import { removeCollectionItems } from './removeCollectionItems';

const { workspace_2 } = WorkspaceFixtures;

describe('removeCollectionItems', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes items from the collection', async () => {
    // Remove the first item
    const result = await removeCollectionItems(collection_1.id, [
      collection_1.items[0],
    ]);

    expect(result.items).toEqual([collection_1.items[1]]);
  });

  it('ignores item IDs that are not in the collection', async () => {
    const result = await removeCollectionItems(collection_1.id, [
      'nonexistent-item',
    ]);

    expect(result.items).toEqual(collection_1.items);
  });

  it('removes the items from the collection of the given workspace', async () => {
    // The collection held by the second workspace as well
    CollectionsStore.in(workspace_2.id).set(collection_1);

    await removeCollectionItems(
      collection_1.id,
      [collection_1.items[0]],
      workspace_2.id,
    );

    // Should update the second workspace's collection, leaving the
    // active workspace's as it was.
    expect(
      CollectionsStore.in(workspace_2.id).get(collection_1.id)?.items,
    ).toEqual([collection_1.items[1]]);
    expect(CollectionsStore).toHaveItem(collection_1.id, collection_1);
  });

  it('updates the collection in the store', async () => {
    const result = await removeCollectionItems(collection_1.id, [
      collection_1.items[0],
    ]);

    expect(CollectionsStore).toHaveItem(collection_1.id, result);
  });

  it('updates lastModified', async () => {
    const result = await removeCollectionItems(collection_1.id, [
      collection_1.items[0],
    ]);

    expect(result.lastModified).toEqual(mockDate);
  });

  it('writes the collection config to the file system', async () => {
    const result = await removeCollectionItems(collection_1.id, [
      collection_1.items[0],
    ]);

    expect(
      MockFs.readJsonFile(resolveCollectionFilePath(collection_1.id)),
    ).toEqual(result);
  });

  it('dispatches the collection updated event', async () =>
    new Promise<void>((done) => {
      Events.addListener(
        CollectionUpdatedEvent,
        'test-collection-updated',
        (payload) => {
          expect(payload.original).toEqual(collection_1);
          expect(payload.updated.items).toEqual([collection_1.items[1]]);
          done();
        },
      );

      removeCollectionItems(collection_1.id, [collection_1.items[0]]);
    }));
});
