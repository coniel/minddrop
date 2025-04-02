import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CollectionsStore } from '../CollectionsStore';
import { cleanup, itemsCollection, setup } from '../test-utils';
import { getCollection } from './getCollection';

describe('getCollection', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the requested collection if it exists', () => {
    // Add a collection to the store
    CollectionsStore.getState().add(itemsCollection);

    // Should return collection from the store
    expect(getCollection(itemsCollection.path)).toEqual(itemsCollection);
  });

  it('returns null if the collection does not exist', () => {
    // Get a missing collection, should return null
    expect(getCollection('foo')).toBeNull();
  });
});
