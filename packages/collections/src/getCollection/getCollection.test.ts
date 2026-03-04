import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CollectionNotFoundError } from '../errors';
import { cleanup, collection_1, setup } from '../test-utils';
import { getCollection } from './getCollection';

describe('getCollection', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('retrieves a collection by ID', () => {
    const result = getCollection(collection_1.id);

    expect(result).toBe(collection_1);
  });

  it('throws an error if the collection does not exist', () => {
    expect(() => getCollection('missing')).toThrow(CollectionNotFoundError);
  });

  it('does not throw if the collection does not exist and throwOnNotFound is false', () => {
    expect(() => getCollection('missing', false)).not.toThrow(
      CollectionNotFoundError,
    );
  });
});
