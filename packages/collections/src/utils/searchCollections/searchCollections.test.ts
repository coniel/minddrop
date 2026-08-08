import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, collection_1, collection_2, setup } from '../../test-utils';
import { searchCollections } from './searchCollections';

describe('searchCollections', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('matches collections by name', () => {
    expect(searchCollections('Collection 2')).toContain(collection_2);
  });

  it('filters collections by ID', () => {
    expect(searchCollections('Collection', [collection_1.id])).toEqual([
      collection_1,
    ]);
  });

  it('returns an empty array when nothing matches', () => {
    expect(searchCollections('xyzq')).toEqual([]);
  });
});
