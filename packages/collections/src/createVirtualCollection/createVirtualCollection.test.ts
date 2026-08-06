import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionCreatedEvent } from '../events';
import { cleanup, mockDate, setup } from '../test-utils';
import { createVirtualCollection } from './createVirtualCollection';

const id = 'virtual-collection-1';
const name = 'Virtual Collection';
const items = ['item-1', 'item-2'];

const expectedCollection = {
  id,
  virtual: true,
  name,
  items,
  created: mockDate,
  lastModified: mockDate,
};

describe('createVirtualCollection', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('creates a virtual collection', () => {
    const collection = createVirtualCollection(id, name, items);

    expect(collection).toEqual(expectedCollection);
  });

  it('adds the collection to the store', () => {
    createVirtualCollection(id, name, items);

    expect(CollectionsStore.get(id)).toEqual(expectedCollection);
  });

  it('defaults items to an empty array', () => {
    const collection = createVirtualCollection(id, name);

    expect(collection.items).toEqual([]);
  });

  it('dispatches the collection created event', () =>
    new Promise<void>((done) => {
      Events.addListener(
        CollectionCreatedEvent,
        'test-virtual-created',
        (payload) => {
          expect(payload.data).toEqual(expectedCollection);
          done();
        },
      );

      createVirtualCollection(id, name, items);
    }));
});
