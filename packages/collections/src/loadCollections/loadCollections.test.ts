import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionsConfigDir, CollectionsConfigFileName } from '../constants';
import {
  cleanup,
  collectionFiles,
  collections,
  collectionsConfigFileDescriptor,
  itemsCollection,
  setup,
} from '../test-utils';
import { loadCollections } from './loadCollections';

const MockFs = initializeMockFileSystem([
  // Collections config file
  collectionsConfigFileDescriptor,
  // Collection config files
  ...collectionFiles,
]);

describe('loadCollections', () => {
  beforeEach(() => {
    setup();

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('throws if the collections config could not be read', () => {
    // Pretend collections file does not exist
    MockFs.removeFile(CollectionsConfigFileName, {
      baseDir: CollectionsConfigDir,
    });

    // Should throw
    expect(() => loadCollections()).rejects.toThrow();
  });

  it('loads collections into the store', async () => {
    // Load the collections
    await loadCollections();

    // Store should contain the collections
    expect(Object.values(CollectionsStore.getState().collections)).toEqual(
      collections,
    );
  });

  it('does not load collections already present in the store', async () => {
    // Add a collection to the store
    CollectionsStore.getState().add(itemsCollection);

    // Load the collections
    await loadCollections();

    // Store should contain the collections
    expect(Object.values(CollectionsStore.getState().collections)).toEqual(
      collections,
    );
  });

  it('dispatches a `collections:load` event', async () =>
    new Promise<void>((done) => {
      // Listen to 'collections:load' events
      Events.addListener('collections:load', 'test', (payload) => {
        // Payload data should be the collections
        expect(payload.data).toEqual(collections);
        done();
      });

      // Load collections
      loadCollections();
    }));

  it('does not dispatch if no new collections were loaded', async () => {
    const dispatch = vi.spyOn(Events, 'dispatch');

    // Load collections
    await loadCollections();

    dispatch.mockClear();

    // Load collections again, nothing new will
    // be loaded.
    await loadCollections();

    // Should not dispatch
    expect(dispatch).not.toHaveBeenCalled();
  });
});
