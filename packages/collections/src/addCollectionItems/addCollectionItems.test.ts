import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionUpdatedEvent } from '../events';
import { MockFs, cleanup, collection_1, mockDate, setup } from '../test-utils';
import { resolveCollectionFilePath } from '../utils';
import { addCollectionItems } from './addCollectionItems';

const newItemIds = ['item-new-1', 'item-new-2'];

describe('addCollectionItems', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds items to the collection', async () => {
    const result = await addCollectionItems(collection_1.id, newItemIds);

    expect(result.items).toEqual([...collection_1.items, ...newItemIds]);
  });

  it('ignores duplicate item IDs', async () => {
    // Include an item ID that already exists in the collection
    const result = await addCollectionItems(collection_1.id, [
      collection_1.items[0],
      'item-new-1',
    ]);

    expect(result.items).toEqual([...collection_1.items, 'item-new-1']);
  });

  it('updates the collection in the store', async () => {
    const result = await addCollectionItems(collection_1.id, newItemIds);

    expect(CollectionsStore.get(collection_1.id)).toEqual(result);
  });

  it('updates lastModified', async () => {
    const result = await addCollectionItems(collection_1.id, newItemIds);

    expect(result.lastModified).toEqual(mockDate);
  });

  it('writes the collection config to the file system', async () => {
    const result = await addCollectionItems(collection_1.id, newItemIds);

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
          expect(payload.updated.items).toEqual([
            ...collection_1.items,
            ...newItemIds,
          ]);
          done();
        },
      );

      addCollectionItems(collection_1.id, newItemIds);
    }));
});
