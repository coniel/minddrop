import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CollectionsStore } from '../CollectionsStore';
import { collection_1, collection_virtual_1 } from '../test-utils';
import { getAllCollections } from './getAllCollections';

describe('getAllCollections', () => {
  beforeEach(() => {
    CollectionsStore.load([collection_1, collection_virtual_1]);
  });

  afterEach(() => {
    CollectionsStore.clear();
  });

  it('returns all collections, including virtual ones', () => {
    expect(getAllCollections()).toEqual([collection_1, collection_virtual_1]);
  });

  it('returns an empty array when there are no collections', () => {
    CollectionsStore.clear();

    expect(getAllCollections()).toEqual([]);
  });
});
