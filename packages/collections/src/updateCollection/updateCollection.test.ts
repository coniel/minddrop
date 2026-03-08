import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionUpdatedEvent, CollectionUpdatedEventData } from '../events';
import {
  MockFs,
  cleanup,
  collection_1,
  collection_virtual_1,
  mockDate,
  setup,
} from '../test-utils';
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

  it('does not write virtual collections to the file system', async () => {
    await updateCollection(collection_virtual_1.id, { name: 'Updated' });

    expect(MockFs.exists(getCollectionFilePath(collection_virtual_1.id))).toBe(
      false,
    );
  });

  it('updates the ID of a virtual collection', async () => {
    const newId = 'new-virtual-id';

    await updateCollection(collection_virtual_1.id, {
      id: newId,
      name: 'Renamed',
    });

    // Old ID should no longer exist
    expect(CollectionsStore.get(collection_virtual_1.id)).toBeNull();

    // New ID should exist with updated data
    const updated = CollectionsStore.get(newId)!;
    expect(updated).not.toBeNull();
    expect(updated.id).toBe(newId);
    expect(updated.name).toBe('Renamed');
    expect(updated.virtual).toBe(true);
  });

  it('throws when changing the ID of a non-virtual collection', async () => {
    await expect(
      updateCollection(collection_1.id, { id: 'new-id', name: 'Renamed' }),
    ).rejects.toThrow('Cannot change the ID of a non-virtual collection');
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
