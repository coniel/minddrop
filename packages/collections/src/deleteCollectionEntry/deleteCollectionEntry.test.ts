import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { CollectionEntryNotFoundError } from '../errors';
import { getCollectionEntry } from '../getCollectionEntry';
import {
  cleanup,
  linksCollection,
  linksEntriesFileDescriptors,
  linksEntry1,
  notesCollection,
  notesEntriesFileDescriptors,
  notesEntry1,
  notesEntry1PropertiesFileDescriptor,
  setup,
} from '../test-utils';
import { deleteCollectionEntry } from './deleteCollectionEntry';

const MockFs = initializeMockFileSystem([
  notesCollection.path,
  linksCollection.path,
  ...notesEntriesFileDescriptors,
  ...linksEntriesFileDescriptors,
]);

describe('deleteCollectionEntry', () => {
  beforeEach(() =>
    setup({
      loadCollections: true,
      loadCollectionTypeConfigs: true,
      loadCollectionEntries: true,
    }),
  );

  afterEach(() => {
    cleanup();
    MockFs.reset();
  });

  it('throws if the entry does not exist', async () => {
    await expect(
      deleteCollectionEntry('non-existent-entry-path'),
    ).rejects.toThrow(CollectionEntryNotFoundError);
  });

  it('removes the entry from the store', async () => {
    await deleteCollectionEntry(notesEntry1.path);

    expect(getCollectionEntry(notesEntry1.path)).toBeNull();
  });

  it('deletes the entry file', async () => {
    await deleteCollectionEntry(notesEntry1.path);

    expect(MockFs.exists(notesEntry1.path)).toBe(false);
  });

  it('deletes the entry properties file', async () => {
    await deleteCollectionEntry(notesEntry1.path);

    expect(MockFs.exists(notesEntry1PropertiesFileDescriptor.path)).toBe(false);
  });

  it('supports entries with no properties file', async () => {
    await expect(
      deleteCollectionEntry(linksEntry1.path),
    ).resolves.not.toThrow();
  });

  it('dispatches a entry delete event', async () =>
    new Promise<void>((done) => {
      Events.addListener('collections:entry:delete', 'test', (payload) => {
        // Payload data should be the deleted entry
        expect(payload.data).toEqual(notesEntry1);
        done();
      });

      deleteCollectionEntry(notesEntry1.path);
    }));
});
