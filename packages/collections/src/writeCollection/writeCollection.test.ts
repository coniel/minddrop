import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CollectionNotFoundError } from '../errors';
import { MockFs, cleanup, collection_1, setup } from '../test-utils';
import { getCollectionFilePath, getCollectionsDirPath } from '../utils';
import { writeCollection } from './writeCollection';

describe('writeCollection', () => {
  beforeEach(() => setup({ loadCollectionFiles: false }));

  afterEach(cleanup);

  it('throws an error if the collection does not exist', async () => {
    await expect(() => writeCollection('missing')).rejects.toThrow(
      CollectionNotFoundError,
    );
  });

  it('creates the collections directory if it does not exist', async () => {
    // Remove the collections directory
    MockFs.removeDir(getCollectionsDirPath());

    await writeCollection(collection_1.id);

    expect(MockFs.exists(getCollectionsDirPath())).toBe(true);
  });

  it('writes the collection config to the file system', async () => {
    await writeCollection(collection_1.id);

    // Get the written collection config from the file system
    const collection = MockFs.readJsonFile(
      getCollectionFilePath(collection_1.id),
    );

    expect(collection).toEqual(collection_1);
  });
});
