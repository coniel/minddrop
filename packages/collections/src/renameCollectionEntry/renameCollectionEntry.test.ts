import { afterEach, beforeEach, describe, expect, it } from 'vitest';
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
import { CollectionEntry, CollectionTypeConfig } from '../types';
import { renameCollectionEntry } from './renameCollectionEntry';

const renamedEntry: CollectionEntry = {
  ...itemsEntry1,
  title: 'New Title',
  path: `${itemsEntry1.collectionPath}/New Title.md`,
};

const config: CollectionTypeConfig = {
  ...markdownCollectionTypeConfig,
  renameEntry: async (path, newTitle, metadata) => ({
    ...renamedEntry,
    title: newTitle,
    metadata,
  }),
};

describe('renameCollectionEntry', () => {
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
      renameCollectionEntry(
        'non-existent-collection-path',
        itemsEntry1.path,
        'New Title',
      ),
    ).rejects.toThrow(CollectionNotFoundError);
  });

  it('throws if the collection type config is not registered', async () => {
    // Unregister the collection type config
    CollectionTypeConfigsStore.clear();

    await expect(
      renameCollectionEntry(
        itemsEntry1.collectionPath,
        itemsEntry1.path,
        'New Title',
      ),
    ).rejects.toThrow(CollectionTypeNotRegisteredError);
  });

  it('throws if the entry does not exist', async () => {
    await expect(
      renameCollectionEntry(
        itemsEntry1.collectionPath,
        'non-existent-entry-path',
        'New Title',
      ),
    ).rejects.toThrow(CollectionEntryNotFoundError);
  });

  it('renames the entry', async () => {
    const entry = await renameCollectionEntry(
      itemsEntry1.collectionPath,
      itemsEntry1.path,
      renamedEntry.title,
    );

    expect(entry.path).toBe(renamedEntry.path);
    expect(entry.title).toBe(renamedEntry.title);
  });

  it('updates the lastModified timestamp in metadata', async () => {
    const entry = await renameCollectionEntry(
      itemsEntry1.collectionPath,
      itemsEntry1.path,
      renamedEntry.title,
    );

    expect(entry.metadata.lastModified).toBeInstanceOf(Date);
    expect(entry.metadata.lastModified).not.toEqual(
      itemsEntry1.metadata.lastModified,
    );
  });

  it('updates the entry in the store', async () => {
    await renameCollectionEntry(
      itemsEntry1.collectionPath,
      itemsEntry1.path,
      renamedEntry.title,
    );

    const entry = getCollectionEntry(renamedEntry.path);

    expect(entry).toBeDefined();
    expect(entry?.path).toBe(renamedEntry.path);
    expect(entry?.title).toBe(renamedEntry.title);
  });

  it('dispatches a entry rename event', async () =>
    new Promise<void>((done) => {
      Events.addListener('collections:entry:rename', 'test', (payload) => {
        // Payload data should be updated entry
        expect(payload.data).toEqual({
          ...renamedEntry,
          metadata: {
            ...renamedEntry.metadata,
            lastModified: expect.any(Date),
          },
        });
        done();
      });

      renameCollectionEntry(
        itemsEntry1.collectionPath,
        itemsEntry1.path,
        renamedEntry.title,
      );
    }));
});
