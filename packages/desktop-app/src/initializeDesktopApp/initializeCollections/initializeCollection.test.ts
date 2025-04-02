import { afterEach, describe, expect, it } from 'vitest';
import {
  COLLECTIONS_TEST_DATA,
  Collections,
  CollectionsConfigDir,
  CollectionsConfigFileName,
  InitialCollectionsConfig,
} from '@minddrop/collections';
import {
  FILE_SYSTEM_TEST_DATA,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { initializeCollections } from './initializeCollection';

const { configsFileDescriptor } = FILE_SYSTEM_TEST_DATA;
const { collectionsConfigFileDescriptor, collectionFiles, collections } =
  COLLECTIONS_TEST_DATA;

const MockFs = initializeMockFileSystem([
  configsFileDescriptor,
  collectionsConfigFileDescriptor,
  ...collectionFiles,
]);

describe('initializeCollections', () => {
  afterEach(() => {
    // Clear collections
    Collections._clear();

    // Reset mock file system
    MockFs.reset();
  });

  it('loads collections from the collections config file', async () => {
    await initializeCollections();

    expect(Collections.getAll()).toEqual(collections);
  });

  it('initializes collections config when the collections config file does not exist', async () => {
    MockFs.removeFile(CollectionsConfigFileName, {
      baseDir: CollectionsConfigDir,
    });

    await initializeCollections();

    expect(Collections.getAll()).toEqual([]);
    expect(
      MockFs.readTextFile(CollectionsConfigFileName, {
        baseDir: CollectionsConfigDir,
      }),
    ).toEqual(JSON.stringify(InitialCollectionsConfig));
  });
});
