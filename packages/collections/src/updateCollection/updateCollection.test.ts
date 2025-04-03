import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs, initializeMockFileSystem } from '@minddrop/file-system';
import { CollectionsStore } from '../CollectionsStore';
import {
  CollectionConfigDirName,
  CollectionConfigFileName,
} from '../constants';
import { CollectionNotFoundError } from '../errors';
import {
  cleanup,
  itemsCollection,
  itemsCollectionFileDescriptor,
  setup,
} from '../test-utils';
import { updateCollection } from './updateCollection';

const MockFs = initializeMockFileSystem([itemsCollectionFileDescriptor]);

describe('updateCollection', () => {
  beforeEach(() => {
    setup();

    CollectionsStore.getState().load([itemsCollection]);
  });

  afterEach(() => {
    cleanup();

    MockFs.reset();
  });

  it('throws if the collection does not exist', () => {
    expect(() => updateCollection('nonexistent', {})).rejects.toThrow(
      CollectionNotFoundError,
    );
  });

  it('returns the updated collection', async () => {
    const updatedCollection = await updateCollection(itemsCollection.path, {
      itemName: 'New Item Name',
    });

    expect(updatedCollection).toMatchObject({
      ...itemsCollection,
      lastModified: expect.any(Date),
      itemName: 'New Item Name',
    });
  });

  it('updates the lastModified field', async () => {
    const updatedCollection = await updateCollection(itemsCollection.path, {
      itemName: 'New Item Name',
    });

    expect(updatedCollection.lastModified.getTime()).toBeGreaterThan(
      itemsCollection.lastModified.getTime(),
    );
  });

  it('updates the collection in the store', async () => {
    await updateCollection(itemsCollection.path, {
      itemName: 'New Item Name',
    });

    const collection =
      CollectionsStore.getState().collections[itemsCollection.path];

    expect(collection).toMatchObject({
      ...itemsCollection,
      lastModified: expect.any(Date),
      itemName: 'New Item Name',
    });
  });

  it('writes the updated collection config to the file system', async () => {
    const { path, ...config } = await updateCollection(itemsCollection.path, {
      itemName: 'New Item Name',
    });

    const collection = MockFs.readTextFile(
      Fs.concatPath(
        itemsCollection.path,
        CollectionConfigDirName,
        CollectionConfigFileName,
      ),
    );

    expect(collection).toEqual(JSON.stringify(config));
  });

  it('dispatches a collection update event', async () =>
    new Promise<void>((done) => {
      Events.addListener('collections:collection:update', 'test', (payload) => {
        // Payload data should be the updated collection
        expect(payload.data).toEqual({
          ...itemsCollection,
          itemName: 'New Item Name',
          lastModified: expect.any(Date),
        });
        done();
      });

      updateCollection(itemsCollection.path, {
        itemName: 'New Item Name',
      });
    }));
});
