import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { CollectionTypeConfigsStore } from '../CollectionTypeConfigsStore';
import {
  CollectionEntryNotFoundError,
  CollectionNotFoundError,
  CollectionTypeNotRegisteredError,
} from '../errors';
import { getCollectionEntry } from '../getCollectionEntry';
import {
  cleanup,
  itemsEntry1,
  markdownCollectionTypeConfig,
  setup,
} from '../test-utils';
import { CollectionTypeConfig } from '../types';
import { deleteCollectionEntry } from './deleteCollectionEntry';

const config: CollectionTypeConfig = {
  ...markdownCollectionTypeConfig,
  deleteEntry: vi.fn(),
};

describe('deleteCollectionEntry', () => {
  beforeEach(() =>
    setup({
      loadCollections: true,
      loadCollectionTypeConfigs: [config],
      loadCollectionEntries: true,
    }),
  );

  afterEach(cleanup);

  it('throws if the collection does not exist', async () => {
    await expect(
      deleteCollectionEntry('non-existent-collection-path', itemsEntry1.path),
    ).rejects.toThrow(CollectionNotFoundError);
  });

  it('throws if the collection type config is not registered', async () => {
    // Unregister the collection type config
    CollectionTypeConfigsStore.clear();

    await expect(
      deleteCollectionEntry(itemsEntry1.collectionPath, itemsEntry1.path),
    ).rejects.toThrow(CollectionTypeNotRegisteredError);
  });

  it('throws if the entry does not exist', async () => {
    await expect(
      deleteCollectionEntry(
        itemsEntry1.collectionPath,
        'non-existent-entry-path',
      ),
    ).rejects.toThrow(CollectionEntryNotFoundError);
  });

  it('removes the entry from the store', async () => {
    await deleteCollectionEntry(itemsEntry1.collectionPath, itemsEntry1.path);

    expect(getCollectionEntry(itemsEntry1.path)).toBeNull();
  });

  it('calls the deleteEntry method of the collection type config', async () => {
    await deleteCollectionEntry(itemsEntry1.collectionPath, itemsEntry1.path);

    expect(config.deleteEntry).toHaveBeenCalledWith(itemsEntry1);
  });

  it('dispatches a entry delete event', async () =>
    new Promise<void>((done) => {
      Events.addListener('collections:entry:delete', 'test', (payload) => {
        // Payload data should be the deleted entry
        expect(payload.data).toEqual(itemsEntry1);
        done();
      });

      deleteCollectionEntry(itemsEntry1.collectionPath, itemsEntry1.path);
    }));
});
