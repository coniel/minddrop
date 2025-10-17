import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import { CollectionEntriesStore } from '../CollectionEntriesStore';
import { CollectionTypeConfigsStore } from '../CollectionTypeConfigsStore';
import { CollectionsStore } from '../CollectionsStore';
import {
  CollectionEntryNotFoundError,
  CollectionNotFoundError,
  CollectionTypeNotRegisteredError,
} from '../errors';
import {
  cleanup,
  filesCollection,
  filesEntriesFileDescriptors,
  filesEntry1,
  notesCollection,
  notesEntriesFileDescriptors,
  notesEntry1,
  setup,
} from '../test-utils';
import { getEntryPropertiesFilePath } from '../utils';
import { updateCollectionEntry } from './updateCollectionEntry';

const update = {
  note: 'Updated note content',
};
const mockDate = new Date('2024-01-01T00:00:00Z');

const updatedEntry = {
  ...notesEntry1,
  properties: {
    ...notesEntry1.properties,
    lastModified: mockDate,
    note: update.note,
  },
};

const MockFs = initializeMockFileSystem([
  notesCollection.path,
  filesCollection.path,
  ...notesEntriesFileDescriptors,
  ...filesEntriesFileDescriptors,
]);

describe('updateCollectionEntry', () => {
  beforeEach(() => {
    setup({
      loadCollections: true,
      loadCollectionTypeConfigs: true,
      loadCollectionEntries: true,
    });

    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
    MockFs.reset();
  });

  it('throws if the collection does not exist', () => {
    CollectionsStore.getState().clear();

    expect(() => updateCollectionEntry(notesEntry1.path, {})).rejects.toThrow(
      CollectionNotFoundError,
    );
  });

  it('throws if the collection type config is not registered', () => {
    // Unregister the collection type config
    CollectionTypeConfigsStore.clear();

    expect(() => updateCollectionEntry(notesEntry1.path, {})).rejects.toThrow(
      CollectionTypeNotRegisteredError,
    );
  });

  it('throws if the entry is not found', async () => {
    await expect(
      updateCollectionEntry('non-existent-entry', update),
    ).rejects.toThrow(CollectionEntryNotFoundError);
  });

  it('throws if updates contains title property', async () => {
    await expect(
      updateCollectionEntry(notesEntry1.path, { title: 'New Title' }),
    ).rejects.toThrow(InvalidParameterError);
  });

  it('merges updates into the entry', async () => {
    const updated = await updateCollectionEntry(notesEntry1.path, update);

    expect(updated).toEqual(updatedEntry);
  });

  it('returns the updated entry', async () => {
    const updated = await updateCollectionEntry(notesEntry1.path, update);

    expect(updated).toEqual(updatedEntry);
  });

  it('updates the lastModified timestamp', async () => {
    const updated = await updateCollectionEntry(notesEntry1.path, update);

    expect(updated.properties.lastModified).toEqual(new Date(mockDate));
  });

  it('updates the entry in the store', async () => {
    await updateCollectionEntry(notesEntry1.path, update);

    expect(CollectionEntriesStore.get(notesEntry1.path)).toEqual(updatedEntry);
  });

  it('writes updated text entry to the file system', async () => {
    await updateCollectionEntry(notesEntry1.path, update);

    const fileContents = MockFs.readTextFile(notesEntry1.path);
    const entryPropertyFileContents = MockFs.readTextFile(
      getEntryPropertiesFilePath(notesEntry1),
    );

    // Entry file should contain updated note content
    expect(fileContents).toContain(update.note);
    // Entry properties file should contain updated lastModified timestamp
    expect(entryPropertyFileContents).toContain(mockDate.toISOString());
  });

  it('writes updated file entry properties to the file system', async () => {
    await updateCollectionEntry(filesEntry1.path, { foo: 'bar' });

    const entryPropertyFileContents = MockFs.readTextFile(
      getEntryPropertiesFilePath(filesEntry1),
    );

    // Entry properties file should contain updated property
    expect(JSON.parse(entryPropertyFileContents).foo).toBe('bar');
    // Entry properties file should contain updated lastModified timestamp
    expect(entryPropertyFileContents).toContain(mockDate.toISOString());
  });

  it('dispatches a entry update event', async () =>
    new Promise<void>((done) => {
      Events.addListener('collections:entry:update', 'test', (payload) => {
        // Payload data should be updated entry
        expect(payload.data).toEqual(updatedEntry);
        done();
      });

      updateCollectionEntry(notesEntry1.path, update);
    }));
});
