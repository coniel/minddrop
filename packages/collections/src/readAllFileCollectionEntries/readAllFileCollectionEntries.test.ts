import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { initializeMockFileSystem } from '@minddrop/file-system';
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
  filesEntry1,
  setup,
} from '../test-utils';
import { readAllFileCollectionEntries } from './readAllFileCollectionEntries';

const MockFs = initializeMockFileSystem([
  filesCollection.path,
  ...filesEntriesFileDescriptors,
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
      readAllFileCollectionEntries(filesCollection.path),
    ).rejects.toThrow(CollectionTypeNotRegisteredError);
  });

  it('throws if the collection does not exist', async () => {
    CollectionTypeConfigsStore.clear();
    await expect(
      readAllFileCollectionEntries('not/a/valid/collection/path'),
    ).rejects.toThrow(CollectionNotFoundError);
  });

  it('reads and returns all text collection entries', async () => {
    const entries = await readAllFileCollectionEntries(filesCollection.path);

    expect(entries.length).toBe(filesEntries.length);

    expect(entries[0]).toEqual(
      expect.objectContaining({
        ...filesEntry1,
        properties: {
          ...filesEntry1.properties,
          created: expect.any(Date),
          lastModified: expect.any(Date),
        },
      }),
    );
  });

  it('ignores files with unsupported extensions', async () => {
    const entries = await readAllFileCollectionEntries(filesCollection.path);

    MockFs.addFiles([
      `${filesCollection.path}/unsupported_file.xyz`,
      `${filesCollection.path}/another_unsupported_file.abc`,
      `${filesCollection.path}/.hidden_file`,
    ]);

    // Ensure only supported files are returned
    expect(entries.length).toBe(filesEntries.length);
  });
});
