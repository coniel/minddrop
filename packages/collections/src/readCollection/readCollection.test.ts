import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, collection_1, setup } from '../test-utils';
import { getCollectionFilePath } from '../utils';
import { readCollection } from './readCollection';

describe('readCollection', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('reads the collection config from the file system', async () => {
    const collection = await readCollection(
      getCollectionFilePath(collection_1.id),
    );

    expect(collection).toEqual(collection_1);
  });

  it('returns null if the collection config does not exist', async () => {
    const collection = await readCollection(
      getCollectionFilePath('missing-collection'),
    );

    expect(collection).toBeNull();
  });
});
