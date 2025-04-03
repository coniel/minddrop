import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { CollectionsStore } from '../CollectionsStore';
import { getCollection } from '../getCollection';
import { getCollectionsConfig } from '../getCollectionsConfig';
import {
  cleanup,
  collectionsConfigFileDescriptor,
  itemsCollection,
  setup,
} from '../test-utils';
import { removeCollection } from './removeCollection';

initializeMockFileSystem([
  // Collections config file
  collectionsConfigFileDescriptor,
  // Collection 1
  itemsCollection.path,
]);

describe('removeCollection', () => {
  beforeEach(() => {
    setup();

    // Add a collection to the store
    CollectionsStore.getState().add(itemsCollection);
  });

  afterEach(cleanup);

  it('removes the collection from the store', async () => {
    // Remove a collection
    await removeCollection(itemsCollection.path);

    // Collection should no longer be in the store
    expect(getCollection(itemsCollection.path)).toBeNull();
  });

  it('removes the collection from the store', async () => {
    // Remove a collection
    await removeCollection(itemsCollection.path);

    // Collection should no longer be in the store
    expect(getCollection(itemsCollection.path)).toBeNull();
  });

  it('updates the collections config file', async () => {
    // Remove a collection
    await removeCollection(itemsCollection.path);

    // Get the collections config
    const config = await getCollectionsConfig();

    // Should remove collection path from collections config
    expect(config.paths.includes(itemsCollection.path)).toBeFalsy();
  });

  it('dispatches a `collections:collection:remove` event', () =>
    new Promise<void>((done) => {
      // Listen to 'collections:collection:remove' events
      Events.addListener('collections:collection:remove', 'test', (payload) => {
        // Payload data should be the collection
        expect(payload.data).toEqual(itemsCollection);
        done();
      });

      // Remove a collection
      removeCollection(itemsCollection.path);
    }));

  it('does nothing if collection does not exist', async () => {
    vi.spyOn(CollectionsStore.getState(), 'remove');

    // Remove a collection that does not exist
    await removeCollection('missing');

    expect(CollectionsStore.getState().remove).not.toHaveBeenCalled();
  });
});
