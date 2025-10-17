import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import { Fs, initializeMockFileSystem } from '@minddrop/file-system';
import { CollectionEntriesStore } from '../CollectionEntriesStore';
import { CollectionTypeConfigsStore } from '../CollectionTypeConfigsStore';
import {
  CollectionNotFoundError,
  CollectionTypeNotRegisteredError,
  InvalidCollectionTypeError,
} from '../errors';
import {
  cleanup,
  filesCollection,
  filesPropertiesDir,
  notesCollection,
  setup,
} from '../test-utils';
import { createFileCollectionEntry } from './createFileCollectionEntry';

const title = 'Example File';
const file = new File(['file content'], `${title}.txt`, { type: 'text/plain' });

const newEntry = {
  collectionPath: filesCollection.path,
  path: Fs.concatPath(filesCollection.path, file.name),
  properties: {
    created: new Date('2023-01-01T00:00:00Z'),
    lastModified: new Date('2023-01-01T00:00:00Z'),
    title,
    fileName: file.name,
    note: null,
  },
};

const MockFs = initializeMockFileSystem([
  filesCollection.path,
  filesPropertiesDir,
  notesCollection.path,
]);

describe('createFileCollectionEntry', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-01-01T00:00:00Z'));

    setup({
      loadCollections: true,
      loadCollectionTypeConfigs: true,
    });
  });

  afterEach(() => {
    cleanup();
    MockFs.reset();
    vi.useRealTimers();
  });

  it('throws if the collection does not exist', async () => {
    await expect(() => createFileCollectionEntry('foo', file)).rejects.toThrow(
      CollectionNotFoundError,
    );
  });

  it('throws if the collection type is not registered', async () => {
    CollectionTypeConfigsStore.clear();

    await expect(() =>
      createFileCollectionEntry(filesCollection.path, file),
    ).rejects.toThrow(CollectionTypeNotRegisteredError);
  });

  it('throws if the collection type is not text', async () => {
    await expect(() =>
      createFileCollectionEntry(notesCollection.path, file),
    ).rejects.toThrow(InvalidCollectionTypeError);
  });

  it('creates a new entry and adds it to the entries store', async () => {
    await createFileCollectionEntry(filesCollection.path, file);

    expect(CollectionEntriesStore.getAll()).toEqual([newEntry]);
  });

  it('writes the file to the file system', async () => {
    await createFileCollectionEntry(filesCollection.path, file);

    const fileExists = MockFs.exists(
      Fs.concatPath(filesCollection.path, file.name),
    );

    expect(fileExists).toBe(true);
  });

  it('writes the entry properties to the files system', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-01-01T00:00:00Z'));

    await createFileCollectionEntry(filesCollection.path, file);

    const properties = MockFs.readTextFile(
      Fs.concatPath(filesPropertiesDir, `${title}.json`),
    );

    expect(JSON.parse(properties)).toEqual({
      created: '2023-01-01T00:00:00.000Z',
      lastModified: '2023-01-01T00:00:00.000Z',
      title,
      fileName: file.name,
      note: null,
    });

    vi.useRealTimers();
  });

  it('increments the file name if a file with the same name exists', async () => {
    // Create an existing file with the same name
    MockFs.writeTextFile(
      Fs.concatPath(filesCollection.path, file.name),
      'existing file content',
    );

    await createFileCollectionEntry(filesCollection.path, file);

    // Should create the new file with an incremented name
    const newFileExists = MockFs.exists(
      Fs.concatPath(filesCollection.path, 'Example File 1.txt'),
    );

    expect(newFileExists).toBe(true);

    // Should create the new properties file with an incremented name
    const properties = MockFs.readTextFile(
      Fs.concatPath(filesPropertiesDir, 'Example File 1.json'),
    );

    expect(JSON.parse(properties).title).toBe('Example File 1');
  });

  it('returns the created file collection entry', async () => {
    const entry = await createFileCollectionEntry(filesCollection.path, file);

    expect(entry).toEqual(newEntry);
  });

  it('dispatches a entries create event', async () =>
    new Promise<void>((done) => {
      Events.addListener('collections:entries:create', 'test', (payload) => {
        // Payload data should be created entry
        expect(payload.data).toEqual(newEntry);
        done();
      });

      createFileCollectionEntry(filesCollection.path, file);
    }));
});
