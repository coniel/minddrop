import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { CollectionEntriesStore } from '../CollectionEntriesStore';
import { CollectionTypeConfigsStore } from '../CollectionTypeConfigsStore';
import {
  CollectionNotFoundError,
  CollectionTypeNotRegisteredError,
} from '../errors';
import {
  cleanup,
  filesCollection,
  filesEntries,
  filesEntriesFileDescriptors,
  notesCollection,
  notesEntries,
  notesEntriesFileDescriptors,
  setup,
} from '../test-utils';
import { loadCollectionEntries } from './loadCollectionEntries';

initializeMockFileSystem([
  notesCollection.path,
  filesCollection.path,
  ...notesEntriesFileDescriptors,
  ...filesEntriesFileDescriptors,
]);

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

    await expect(loadCollectionEntries(notesCollection.path)).rejects.toThrow(
      CollectionTypeNotRegisteredError,
    );
  });

  it('throws if the collection does not exist', async () => {
    CollectionTypeConfigsStore.clear();
    await expect(
      loadCollectionEntries('not/a/valid/collection/path'),
    ).rejects.toThrow(CollectionNotFoundError);
  });

  it('loads text collection entries into the entries store', async () => {
    await loadCollectionEntries(notesCollection.path);

    expect(CollectionEntriesStore.getAll()).toEqual(notesEntries);
  });

  it('loads file collection entries into the entries store', async () => {
    await loadCollectionEntries(filesCollection.path);

    expect(CollectionEntriesStore.getAll()).toEqual(filesEntries);
  });

  it('dispatches a entries load event', async () =>
    new Promise<void>((done) => {
      Events.addListener('collections:entries:load', 'test', (payload) => {
        // Payload data should be the entries
        expect(payload.data).toEqual(notesEntries);
        done();
      });

      loadCollectionEntries(notesCollection.path);
    }));
});
