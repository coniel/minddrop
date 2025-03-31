import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  Fs,
  InvalidPathError,
  initializeMockFileSystem,
} from '@minddrop/file-system';
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
import { getCollectionFromPath } from './getCollectionFromPath';

const collection_PATH = itemsCollection.path;
const collection_CONFIG_PATH = Fs.concatPath(
  itemsCollection.path,
  CollectionConfigDirName,
  CollectionConfigFileName,
);

const MockFs = initializeMockFileSystem([
  // Collection config file
  {
    path: collection_CONFIG_PATH,
    textContent: JSON.stringify(itemsCollectionConfig),
  },
]);

describe('getCollectionFromPath', () => {
  beforeEach(() => {
    setup();

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('throws if the collection path does not exist', () => {
    // Pretend collection dir does not exist
    MockFs.clear();

    // Attempt to get the collection config, should
    // throw a InvalidPathError.
    expect(() => getCollectionFromPath(collection_PATH)).rejects.toThrow(
      InvalidPathError,
    );
  });

  it('returns the collection config if it exists', async () => {
    // Get the collection config
    const config = await getCollectionFromPath(collection_PATH);

    // Should return the config
    expect(config).toEqual(itemsCollection);
  });
});
