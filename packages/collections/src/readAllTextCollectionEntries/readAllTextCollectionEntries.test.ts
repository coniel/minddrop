import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
import { CollectionTypeConfigsStore } from '../CollectionTypeConfigsStore';
import {
  CollectionNotFoundError,
  CollectionTypeNotRegisteredError,
} from '../errors';
import {
  cleanup,
  linksCollection,
  linksEntries,
  linksEntriesFileDescriptors,
  linksEntry1,
  notesCollection,
  notesEntriesFileDescriptors,
  notesEntry1,
  notesEntry2,
  setup,
} from '../test-utils';
import { readAllTextCollectionEntries } from './readAllTextCollectionEntries';

initializeMockFileSystem([
  notesCollection.path,
  linksCollection.path,
  ...notesEntriesFileDescriptors,
  ...linksEntriesFileDescriptors,
]);

describe('readAllTextCollectionEntries', () => {
  beforeEach(() =>
    setup({
      loadCollections: true,
      loadCollectionTypeConfigs: true,
    }),
  );

  afterEach(cleanup);

  it('throws if the collection type is not registered', async () => {
    CollectionTypeConfigsStore.clear();

    await expect(
      readAllTextCollectionEntries(notesCollection.path),
    ).rejects.toThrow(CollectionTypeNotRegisteredError);
  });

  it('throws if the collection does not exist', async () => {
    CollectionTypeConfigsStore.clear();
    await expect(
      readAllTextCollectionEntries('not/a/valid/collection/path'),
    ).rejects.toThrow(CollectionNotFoundError);
  });

  it('reads and returns all text collection entries', async () => {
    const entries = await readAllTextCollectionEntries(notesCollection.path);

    expect(entries).toEqual([
      expect.objectContaining({
        ...notesEntry1,
        properties: {
          ...notesEntry1.properties,
          created: expect.any(Date),
          lastModified: expect.any(Date),
        },
      }),
      expect.objectContaining({
        ...notesEntry2,
        properties: {
          ...notesEntry2.properties,
          created: expect.any(Date),
          lastModified: expect.any(Date),
        },
      }),
    ]);
  });

  it('supports collections without properties files', async () => {
    const entries = await readAllTextCollectionEntries(linksCollection.path);

    expect(entries).toHaveLength(linksEntries.length);

    expect(entries[0]).toEqual(
      expect.objectContaining({
        ...linksEntry1,
        properties: {
          ...linksEntry1.properties,
          created: expect.any(Date),
          lastModified: expect.any(Date),
        },
      }),
    );
  });
});
