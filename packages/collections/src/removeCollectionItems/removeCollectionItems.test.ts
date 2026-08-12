import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionUpdatedEvent, CollectionUpdatedEventData } from '../events';
import { MockFs, cleanup, collection_1, mockDate, setup } from '../test-utils';
import { resolveCollectionFilePath } from '../utils';
import { removeCollectionItems } from './removeCollectionItems';

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

  it('updates the collection in the store', async () => {
    const result = await removeCollectionItems(collection_1.id, [
      collection_1.items[0],
    ]);

    expect(CollectionsStore.get(collection_1.id)).toEqual(result);
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
      Events.addListener<CollectionUpdatedEventData>(
        CollectionUpdatedEvent,
        'test-collection-updated',
        (payload) => {
          expect(payload.data.original).toEqual(collection_1);
          expect(payload.data.updated.items).toEqual([collection_1.items[1]]);
          done();
        },
      );

      removeCollectionItems(collection_1.id, [collection_1.items[0]]);
    }));
});
