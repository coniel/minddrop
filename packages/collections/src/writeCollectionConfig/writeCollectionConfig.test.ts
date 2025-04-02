import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  Fs,
  InvalidPathError,
  initializeMockFileSystem,
} from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import { CollectionsStore } from '../CollectionsStore';
import {
  CollectionConfigDirName,
  CollectionConfigFileName,
} from '../constants';
import {
  cleanup,
  itemsCollection,
  itemsCollectionConfig,
  setup,
} from '../test-utils';
import { writeCollectionConfig } from './writeCollectionConfig';

const COLLECTION_PATH = itemsCollection.path;
const COLLECTION_CONFIG_DIR_PATH = Fs.concatPath(
  itemsCollection.path,
  CollectionConfigDirName,
);
const COLLECTION_CONFIG_FILE_PATH = Fs.concatPath(
  COLLECTION_CONFIG_DIR_PATH,
  CollectionConfigFileName,
);

const MockFs = initializeMockFileSystem([
  // Collection config dir
  COLLECTION_CONFIG_DIR_PATH,
]);

describe('writeCollectionConfig', () => {
  beforeEach(() => {
    setup();

    // Load test collections into the store
    CollectionsStore.getState().add(itemsCollection);

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('throws if the collection does not exist', () => {
    // Attempt to write the config file of a missing collection.
    // Should throw a InvalidParameterError.
    expect(() =>
      writeCollectionConfig('missing-collection'),
    ).rejects.toThrowError(InvalidParameterError);
  });

  it('throws if the collection dir does not exist', () => {
    // Remove collection directory
    MockFs.removeFile(COLLECTION_PATH);

    // Attempt to write the config file of a collection with a missing dir.
    // Should throw a InvalidPathError.
    expect(() =>
      writeCollectionConfig(itemsCollection.path),
    ).rejects.toThrowError(InvalidPathError);
  });

  it('creates the collection config dir if it does not exist', async () => {
    // Pretend collection config dir does not exist
    MockFs.removeDir(COLLECTION_CONFIG_DIR_PATH);

    // Write collection config
    await writeCollectionConfig(COLLECTION_PATH);

    // Should create collection config dir
    expect(MockFs.exists(COLLECTION_CONFIG_DIR_PATH)).toBe(true);
  });

  it('writes config values to the config file', async () => {
    // Write collection config
    await writeCollectionConfig(COLLECTION_PATH);

    // Should write config values to config file
    expect(MockFs.readTextFile(COLLECTION_CONFIG_FILE_PATH)).toBe(
      JSON.stringify(itemsCollectionConfig),
    );
  });
});
