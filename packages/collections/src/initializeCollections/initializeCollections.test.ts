import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { registerItemReferenceAdapter } from '@minddrop/item-references';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionsLoadedEvent } from '../events';
import { MockFs, cleanup, collections, setup } from '../test-utils';
import { resolveCollectionFilePath, resolveCollectionsDirPath } from '../utils';
import { initializeCollections } from './initializeCollections';

describe('initializeCollections', () => {
  beforeEach(() =>
    setup({ loadCollections: false, loadVirtualCollections: false }),
  );

  afterEach(cleanup);

  it('creates the collections directory if it does not exist', async () => {
    // Remove the collections directory
    MockFs.removeFile(resolveCollectionsDirPath());

    await initializeCollections();

    expect(MockFs.exists(resolveCollectionsDirPath())).toBe(true);
  });

  it('loads collections from the collections directory into the store', async () => {
    await initializeCollections();

    expect(CollectionsStore.getAllArray()).toEqual(collections);
  });

  it('filters out null collections', async () => {
    // Create an invalid collection file
    MockFs.writeTextFile(
      resolveCollectionFilePath('invalid-collection'),
      'invalid json',
    );

    await initializeCollections();

    expect(CollectionsStore.getAllArray()).toEqual(collections);
  });

  it('dispatches a collections loaded event', async () =>
    new Promise<void>((done) => {
      Events.addListener(CollectionsLoadedEvent, 'test', (payload) => {
        expect(payload.data).toEqual(collections);
        done();
      });

      initializeCollections();
    }));

  it('resolves item references through the registered adapter', async () => {
    // Register an adapter that prefixes resolved IDs
    registerItemReferenceAdapter({
      type: 'database-entry',
      serialize: (id) => id,
      match: (reference) => ({ type: 'database-entry', id: `id:${reference}` }),
    });

    await initializeCollections();

    const [firstCollection] = collections;
    const loaded = CollectionsStore.get(firstCollection.id);

    // The loaded items should be resolved item IDs
    expect(loaded?.items).toEqual(
      firstCollection.items.map((id) => `id:${id}`),
    );
  });
});
