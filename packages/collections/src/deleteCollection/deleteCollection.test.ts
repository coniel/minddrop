import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { CollectionsStore } from '../CollectionsStore';
import { getCollection } from '../getCollection';
import { getCollectionsConfig } from '../getCollectionsConfig';
import {
  cleanup,
  collectionsConfigFileDescriptor,
  itemsCollection,
  itemsCollectionConfigPath,
  setup,
} from '../test-utils';
import { deleteCollection } from './deleteCollection';

const MockFs = initializeMockFileSystem([
  // Collections config file
  collectionsConfigFileDescriptor,
  // Collection 1 config file
  itemsCollectionConfigPath,
]);

describe('deleteCollection', () => {
  beforeEach(() => {
    setup();

    // Add a collection to the store
    CollectionsStore.getState().add(itemsCollection);

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('removes the collection from the store', async () => {
    // Remove a collection
    await deleteCollection(itemsCollection.path);

    // Collection should no longer be in the store
    expect(getCollection(itemsCollection.path)).toBeNull();
  });

  it('deletes the collection folder', async () => {
    // Remove a collection
    await deleteCollection(itemsCollection.path);

    // Should delete the collection folder
    expect(MockFs.existsInTrash(itemsCollection.path)).toBeTruthy();
  });

  it('removes collection path from collections config', async () => {
    // Delete a collection
    await deleteCollection(itemsCollection.path);

    // Get collections config
    const collectionsConfig = await getCollectionsConfig();

    // Should remove collection path from collections config
    expect(collectionsConfig.paths.includes(itemsCollection.path)).toBeFalsy();
  });

  it('dispatches a `collections:collection:delete` event', () =>
    new Promise<void>((done) => {
      // Listen to 'collections:collection:delete' events
      Events.addListener('collections:collection:delete', 'test', (payload) => {
        // Payload data should be the collection
        expect(payload.data).toEqual(itemsCollection);
        done();
      });

      // Remove a collection
      deleteCollection(itemsCollection.path);
    }));

  it('does nothing if collection does not exist', async () => {
    // Remove a collection that does not exist, should not throw
    expect(async () => deleteCollection('missing')).not.toThrow();
  });
});
