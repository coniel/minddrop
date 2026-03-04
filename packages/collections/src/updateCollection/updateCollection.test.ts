import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionUpdatedEvent, CollectionUpdatedEventData } from '../events';
import { MockFs, cleanup, collection_1, mockDate, setup } from '../test-utils';
import { Collection } from '../types';
import { getCollectionFilePath } from '../utils';
import { updateCollection } from './updateCollection';

const update = {
  name: 'Updated Collection 1',
};
const updatedCollection: Collection = {
  ...collection_1,
  ...update,
  lastModified: mockDate,
};

describe('updateCollection', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates the collection in the store', async () => {
    await updateCollection(collection_1.id, update);

    expect(CollectionsStore.get(collection_1.id)).toEqual(updatedCollection);
  });

  it('writes the collection config to the file system', async () => {
    await updateCollection(collection_1.id, update);

    expect(MockFs.readJsonFile(getCollectionFilePath(collection_1.id))).toEqual(
      updatedCollection,
    );
  });

  it('returns the updated collection', async () => {
    const collection = await updateCollection(collection_1.id, update);

    expect(collection).toEqual(updatedCollection);
  });

  it('dispatches the collection updated event', async () =>
    new Promise<void>((done) => {
      Events.addListener<CollectionUpdatedEventData>(
        CollectionUpdatedEvent,
        'test-collection-updated',
        (payload) => {
          expect(payload.data.original).toEqual(collection_1);
          expect(payload.data.updated).toEqual(updatedCollection);
          done();
        },
      );

      updateCollection(collection_1.id, update);
    }));
});
