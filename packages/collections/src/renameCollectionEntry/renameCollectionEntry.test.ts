import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import {
  PathConflictError,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { CollectionTypeConfigsStore } from '../CollectionTypeConfigsStore';
import { CollectionsStore } from '../CollectionsStore';
import {
  CollectionEntryNotFoundError,
  CollectionNotFoundError,
  CollectionTypeNotRegisteredError,
} from '../errors';
import { getCollectionEntry } from '../getCollectionEntry';
import {
  cleanup,
  filesCollection,
  filesEntriesFileDescriptors,
  filesEntry1,
  notesCollection,
  notesEntriesFileDescriptors,
  notesEntry1,
  notesEntry2,
  setup,
} from '../test-utils';
import { CollectionEntry } from '../types';
import {
  generateEntryPropertiesFilePath,
  getEntryPropertiesFilePath,
} from '../utils';
import { renameCollectionEntry } from './renameCollectionEntry';

const newTitle = 'New Title';
const mockDate = '2024-01-01T00:00:00.000Z';

const renamedEntry: CollectionEntry = {
  ...notesEntry1,
  path: `${notesEntry1.collectionPath}/${newTitle}.md`,
  properties: {
    ...notesEntry1.properties,
    title: newTitle,
  },
};

const MockFs = initializeMockFileSystem([
  notesCollection.path,
  filesCollection.path,
  ...notesEntriesFileDescriptors,
  ...filesEntriesFileDescriptors,
]);

describe('renameCollectionEntry', () => {
  beforeEach(() => {
    setup({
      loadCollections: true,
      loadCollectionTypeConfigs: true,
      loadCollectionEntries: true,
    });

    vi.useFakeTimers();
    vi.setSystemTime(new Date(mockDate));
  });

  afterEach(() => {
    cleanup();
    MockFs.reset();
    vi.useRealTimers();
  });

  it('throws if the collection does not exist', async () => {
    // Remove the collection to simulate a non-existent collection
    CollectionsStore.getState().clear();

    await expect(
      renameCollectionEntry(notesEntry1.path, 'New Title'),
    ).rejects.toThrow(CollectionNotFoundError);
  });

  it('throws if the collection type config is not registered', async () => {
    // Unregister the collection type config
    CollectionTypeConfigsStore.clear();

    await expect(
      renameCollectionEntry(notesEntry1.path, 'New Title'),
    ).rejects.toThrow(CollectionTypeNotRegisteredError);
  });

  it('throws if the entry does not exist', async () => {
    await expect(
      renameCollectionEntry('non-existent-entry-path', 'New Title'),
    ).rejects.toThrow(CollectionEntryNotFoundError);
  });

  it('throws if renaiming causes a conflict with an existing entry', async () => {
    // Rename notesEntry1 to have the same title as notesEntry2
    expect(
      renameCollectionEntry(notesEntry1.path, notesEntry2.properties.title),
    ).rejects.toThrow(PathConflictError);
  });

  it('renames the entry', async () => {
    const entry = await renameCollectionEntry(notesEntry1.path, newTitle);

    expect(entry.path).toBe(renamedEntry.path);
    expect(entry.properties.title).toBe(newTitle);
  });

  it('updates the lastModified timestamp', async () => {
    const entry = await renameCollectionEntry(notesEntry1.path, newTitle);

    expect(entry.properties.lastModified).toEqual(new Date(mockDate));
  });

  it('updates the entry in the store', async () => {
    await renameCollectionEntry(notesEntry1.path, newTitle);

    const entry = getCollectionEntry(renamedEntry.path);

    expect(entry).toBeDefined();
    expect(entry?.path).toBe(renamedEntry.path);
    expect(entry?.properties.title).toBe(newTitle);
  });

  it('renames the entry file', async () => {
    await renameCollectionEntry(notesEntry1.path, newTitle);

    expect(MockFs.exists(renamedEntry.path)).toBe(true);
    expect(MockFs.exists(notesEntry1.path)).toBe(false);
  });

  it('renames the entry properties file', async () => {
    const oldPropertiesFilePath = getEntryPropertiesFilePath(notesEntry1);
    const newPropertiesFilePath = getEntryPropertiesFilePath(renamedEntry);

    await renameCollectionEntry(notesEntry1.path, newTitle);

    expect(MockFs.exists(newPropertiesFilePath)).toBe(true);
    expect(MockFs.exists(oldPropertiesFilePath)).toBe(false);
  });

  it('supports entries without properties files', async () => {
    // Remove the properties file for the entry
    const propertiesFilePath = getEntryPropertiesFilePath(notesEntry1);
    MockFs.removeFile(propertiesFilePath);

    expect(() =>
      renameCollectionEntry(notesEntry1.path, newTitle),
    ).not.toThrow();
  });

  it('writes updated text entry to the file system', async () => {
    await renameCollectionEntry(notesEntry1.path, newTitle);

    const entryFileContent = MockFs.readTextFile(renamedEntry.path);
    const entryPropertiesFileContent = MockFs.readTextFile(
      getEntryPropertiesFilePath(renamedEntry),
    );

    // Entry file content should contain the new title
    expect(entryFileContent).toContain(`# ${newTitle}`);
    // Entry properties file content should contain the updated lastModified timestamp
    expect(entryPropertiesFileContent).toContain(mockDate);
  });

  it('writes updated file entry properties to the file system', async () => {
    await renameCollectionEntry(filesEntry1.path, newTitle);

    const entryPropertiesFileContent = MockFs.readTextFile(
      generateEntryPropertiesFilePath(filesCollection.path, `${newTitle}.pdf`),
    );

    // Entry properties file content should contain the updated lastModified timestamp
    expect(JSON.parse(entryPropertiesFileContent).lastModified).toBe(mockDate);
  });

  it('dispatches a entry rename event', async () =>
    new Promise<void>((done) => {
      Events.addListener('collections:entry:rename', 'test', (payload) => {
        // Payload data should be updated entry
        expect(payload.data).toEqual({
          ...renamedEntry,
          properties: {
            ...renamedEntry.properties,
            lastModified: new Date(mockDate),
          },
        });
        done();
      });

      renameCollectionEntry(notesEntry1.path, newTitle);
    }));
});
