import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import {
  Fs,
  InvalidPathError,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { CollectionsStore } from '../CollectionsStore';
import {
  CollectionConfigDirName,
  CollectionConfigFileName,
} from '../constants';
import { getCollectionsConfig } from '../getCollectionsConfig';
import {
  cleanup,
  collectionsConfigFileDescriptor,
  collectionsPath,
  itemsCollectionConfig,
  setup,
} from '../test-utils';
import { Collection, CollectionConfig } from '../types';
import { addCollectionFromPath } from './addCollectionFromPath';

const newCollectionConfig: CollectionConfig = {
  ...itemsCollectionConfig,
  name: 'New Collection',
};

const newCollection: Collection = {
  ...newCollectionConfig,
  path: Fs.concatPath(collectionsPath, newCollectionConfig.name),
};

const MockFs = initializeMockFileSystem([
  // Collections config file
  collectionsConfigFileDescriptor,
  // Collection to add
  {
    textContent: JSON.stringify(newCollectionConfig),
    path: Fs.concatPath(
      newCollection.path,
      CollectionConfigDirName,
      CollectionConfigFileName,
    ),
  },
]);

describe('addCollection', () => {
  beforeEach(() => {
    setup();

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('throws if the collection does not exist', () => {
    // Pretend collection directory does not exist
    MockFs.clear();

    expect(() =>
      addCollectionFromPath(newCollection.path),
    ).rejects.toThrowError(InvalidPathError);
  });

  it('adds the collection to the store', async () => {
    // Add a collection
    await addCollectionFromPath(newCollection.path);

    // It should add the collection to the store
    expect(CollectionsStore.getState().collections[newCollection.path]).toEqual(
      newCollection,
    );
  });

  it('persists collection to collections config file', async () => {
    // Add a collection
    await addCollectionFromPath(newCollection.path);

    // Get the collections config
    const config = await getCollectionsConfig();

    // It should persist the new collection
    expect(config.paths.includes(newCollection.path)).toBe(true);
  });

  it('dispatches a collections add event', async () =>
    new Promise<void>((done) => {
      Events.addListener('collections:collection:add', 'test', (payload) => {
        // Payload data should be the collection
        expect(payload.data).toEqual(newCollection);
        done();
      });

      // Add a collection
      addCollectionFromPath(newCollection.path);
    }));

  it('returns the new collection', async () => {
    // Add a collection
    const collection = await addCollectionFromPath(newCollection.path);

    // Should return a collection object
    expect(collection).toEqual(newCollection);
  });
});
