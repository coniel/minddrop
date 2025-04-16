import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { CollectionEntriesStore } from '../CollectionEntriesStore';
import { CollectionTypeConfigsStore } from '../CollectionTypeConfigsStore';
import {
  CollectionEntryNotFoundError,
  CollectionNotFoundError,
  CollectionTypeNotRegisteredError,
} from '../errors';
import {
  cleanup,
  itemsCollection,
  itemsEntry1,
  markdownCollectionTypeConfig,
  setup,
} from '../test-utils';
import { CollectionTypeConfig } from '../types';
import { updateCollectionEntry } from './updateCollectionEntry';

const collectionTypeConfig: CollectionTypeConfig = {
  ...markdownCollectionTypeConfig,
  updateEntry: async (entry) => ({
    ...entry,
    metadata: {
      ...entry.metadata,
      updated: true,
    },
  }),
};

const update = { properties: { foo: 'bar' } };
const updatedEntry = {
  ...itemsEntry1,
  properties: update.properties,
  metadata: {
    ...itemsEntry1.metadata,
    lastModified: expect.any(Date),
    updated: true,
  },
};

describe('updateCollectionEntry', () => {
  beforeEach(() => {
    setup({
      loadCollections: true,
      loadCollectionEntries: true,
    });

    CollectionTypeConfigsStore.add(collectionTypeConfig);
  });

  afterEach(cleanup);

  it('throws if the collection does not exist', () => {
    expect(() =>
      updateCollectionEntry('non-existent-collection', itemsEntry1.path, {}),
    ).rejects.toThrow(CollectionNotFoundError);
  });

  it('throws if the collection type config is not registered', () => {
    // Unregister the collection type config
    CollectionTypeConfigsStore.clear();

    expect(() =>
      updateCollectionEntry(itemsCollection.path, itemsEntry1.path, {}),
    ).rejects.toThrow(CollectionTypeNotRegisteredError);
  });

  it('throws if the entry is not found', async () => {
    await expect(
      updateCollectionEntry(itemsCollection.path, 'non-existent-entry', update),
    ).rejects.toThrow(CollectionEntryNotFoundError);
  });

  it('merges updates into the entry', async () => {
    const updated = await updateCollectionEntry(
      itemsCollection.path,
      itemsEntry1.path,
      update,
    );

    expect(updated).toEqual(updatedEntry);
  });

  it('returns the updated entry', async () => {
    const updated = await updateCollectionEntry(
      itemsCollection.path,
      itemsEntry1.path,
      update,
    );

    expect(updated).toEqual(updatedEntry);
  });

  it('updates the lastModified timestamp in metadata', async () => {
    const updated = await updateCollectionEntry(
      itemsCollection.path,
      itemsEntry1.path,
      update,
    );

    expect(updated.metadata.lastModified).not.toEqual(
      itemsEntry1.metadata.lastModified,
    );
  });

  it('updates the entry in the store', async () => {
    await updateCollectionEntry(itemsCollection.path, itemsEntry1.path, update);

    expect(CollectionEntriesStore.get(itemsEntry1.path)).toEqual(updatedEntry);
  });

  it('dispatches a entry update event', async () =>
    new Promise<void>((done) => {
      Events.addListener('collections:entry:update', 'test', (payload) => {
        // Payload data should be updated entry
        expect(payload.data).toEqual(updatedEntry);
        done();
      });

      updateCollectionEntry(itemsCollection.path, itemsEntry1.path, update);
    }));
});
