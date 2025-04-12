import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { CollectionEntriesStore } from '../CollectionEntriesStore';
import { CollectionTypeConfigsStore } from '../CollectionTypeConfigsStore';
import {
  CollectionNotFoundError,
  CollectionTypeNotRegisteredError,
} from '../errors';
import { cleanup, itemsCollection, itemsEntries, setup } from '../test-utils';
import { loadCollectionEntries } from './loadCollectionEntries';

describe('loadCollectionEntries', () => {
  beforeEach(() =>
    setup({
      loadCollections: true,
      loadCollectionTypeConfigs: true,
    }),
  );

  afterEach(cleanup);

  it('throws if the collection type is not registered', async () => {
    CollectionTypeConfigsStore.clear();

    await expect(loadCollectionEntries(itemsCollection.path)).rejects.toThrow(
      CollectionTypeNotRegisteredError,
    );
  });

  it('throws if the collection does not exist', async () => {
    CollectionTypeConfigsStore.clear();
    await expect(
      loadCollectionEntries('not/a/valid/collection/path'),
    ).rejects.toThrow(CollectionNotFoundError);
  });

  it('loads the collection entries into the entries store', async () => {
    await loadCollectionEntries(itemsCollection.path);

    expect(CollectionEntriesStore.getAll()).toEqual(itemsEntries);
  });

  it('dispatches a entries load event', async () =>
    new Promise<void>((done) => {
      Events.addListener('collections:entries:load', 'test', (payload) => {
        // Payload data should be the entries
        expect(payload.data).toEqual(itemsEntries);
        done();
      });

      loadCollectionEntries(itemsCollection.path);
    }));
});
