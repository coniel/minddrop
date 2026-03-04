import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionCreatedEvent } from '../events';
import { MockFs, cleanup, mockDate, setup } from '../test-utils';
import { getCollectionFilePath } from '../utils';
import { createCollection } from './createCollection';

const newCollection = {
  id: expect.any(String),
  created: mockDate,
  lastModified: mockDate,
  entries: [],
  name: 'Collection',
};

describe('createCollection', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates a collection', async () => {
    const collection = await createCollection();

    expect(collection).toEqual(newCollection);
  });

  it('adds the collection to the store', async () => {
    const collection = await createCollection();

    expect(CollectionsStore.get(collection.id)).toEqual(newCollection);
  });

  it('writes the collection config to the file system', async () => {
    const collection = await createCollection();

    expect(MockFs.readJsonFile(getCollectionFilePath(collection.id))).toEqual(
      newCollection,
    );
  });

  it('dispatches the collection created event', async () =>
    new Promise<void>((done) => {
      Events.addListener(
        CollectionCreatedEvent,
        'test-collection-created',
        (payload) => {
          expect(payload.data).toEqual(newCollection);
          done();
        },
      );

      createCollection();
    }));
});
