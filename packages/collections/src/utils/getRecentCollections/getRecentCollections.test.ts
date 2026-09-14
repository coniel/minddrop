import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CollectionsStore } from '../../CollectionsStore';
import { cleanup, collection_1, setup } from '../../test-utils';
import { Collection } from '../../types';
import { getRecentCollections } from './getRecentCollections';

// Collections with distinct creation dates, newer than the ones
// the fixtures carry.
const middleCollection: Collection = {
  ...collection_1,
  id: 'collection_middle',
  created: new Date('2026-02-01T00:00:00.000Z'),
};
const newestCollection: Collection = {
  ...collection_1,
  id: 'collection_newest',
  created: new Date('2026-03-01T00:00:00.000Z'),
};

describe('getRecentCollections', () => {
  beforeEach(() => {
    setup();

    // Load extra collections with distinct creation dates
    CollectionsStore.load([middleCollection, newestCollection]);
  });

  afterEach(cleanup);

  it('sorts the collections by creation date, newest first', () => {
    expect(getRecentCollections(2)).toEqual([
      newestCollection,
      middleCollection,
    ]);
  });

  it('returns no more collections than the limit', () => {
    expect(getRecentCollections(1)).toEqual([newestCollection]);
  });
});
