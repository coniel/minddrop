import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { registerItemReferenceAdapter } from '@minddrop/item-references';
import { InvalidParameterError } from '@minddrop/utils';
import { CollectionsStore } from '../CollectionsStore';
import { CollectionNotFoundError } from '../errors';
import { MockFs, cleanup, collection_1, setup } from '../test-utils';
import { Collection } from '../types';
import { getCollectionFilePath, getCollectionsDirPath } from '../utils';
import { writeCollection } from './writeCollection';

describe('writeCollection', () => {
  beforeEach(() => setup({ loadCollectionFiles: false }));

  afterEach(cleanup);

  it('throws an error if the collection does not exist', async () => {
    await expect(() => writeCollection('missing')).rejects.toThrow(
      CollectionNotFoundError,
    );
  });

  it('throws an error if the collection is virtual', async () => {
    // Add a virtual collection to the store
    CollectionsStore.set({ ...collection_1, id: 'virtual-1', virtual: true });

    await expect(() => writeCollection('virtual-1')).rejects.toThrow(
      InvalidParameterError,
    );
  });

  it('creates the collections directory if it does not exist', async () => {
    // Remove the collections directory
    MockFs.removeDir(getCollectionsDirPath());

    await writeCollection(collection_1.id);

    expect(MockFs.exists(getCollectionsDirPath())).toBe(true);
  });

  it('writes the collection config to the file system', async () => {
    await writeCollection(collection_1.id);

    // Get the written collection config from the file system
    const collection = MockFs.readJsonFile(
      getCollectionFilePath(collection_1.id),
    );

    expect(collection).toEqual(collection_1);
  });

  it('serializes item references through the registered adapter', async () => {
    // Register an adapter that converts IDs to reference strings
    registerItemReferenceAdapter({
      type: 'database-entry',
      serialize: (id) => `ref:${id}`,
      match: () => null,
    });

    await writeCollection(collection_1.id);

    const collection = MockFs.readJsonFile<Collection>(
      getCollectionFilePath(collection_1.id),
    );

    // The written items should be serialized references
    expect(collection.items).toEqual(
      collection_1.items.map((id) => `ref:${id}`),
    );
    // The store should keep the raw item IDs
    expect(CollectionsStore.get(collection_1.id)?.items).toEqual(
      collection_1.items,
    );
  });
});
