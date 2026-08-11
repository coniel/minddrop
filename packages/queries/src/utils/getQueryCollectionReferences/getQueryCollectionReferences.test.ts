import { describe, expect, it } from 'vitest';
import { query_1 } from '../../test-utils';
import { Query, QueryCollectionFilterNode } from '../../types';
import { getQueryCollectionReferences } from './getQueryCollectionReferences';

// A query with the given collection filter nodes appended to
// the fixture query's graph
function queryWithCollectionFilters(
  filters: Partial<QueryCollectionFilterNode>[],
): Query {
  return {
    ...query_1,
    nodes: [
      ...query_1.nodes,
      ...filters.map((filter, index) => ({
        id: `query-node_collection-filter-${index}`,
        type: 'collection-filter' as const,
        x: 0,
        y: 0,
        source: 'collection' as const,
        collection: '',
        operator: 'is-in' as const,
        ...filter,
      })),
    ],
  };
}

describe('getQueryCollectionReferences', () => {
  it('returns no references when the query has no collection filters', () => {
    expect(getQueryCollectionReferences(query_1)).toEqual({
      collectionIds: [],
      anyCollection: false,
    });
  });

  it('returns the referenced collection IDs', () => {
    const query = queryWithCollectionFilters([
      { collection: 'collection_1' },
      { collection: 'collection_2' },
    ]);

    expect(getQueryCollectionReferences(query).collectionIds).toEqual([
      'collection_1',
      'collection_2',
    ]);
  });

  it('ignores nodes without a collection', () => {
    const query = queryWithCollectionFilters([
      {},
      { collection: 'collection_1' },
    ]);

    expect(getQueryCollectionReferences(query).collectionIds).toEqual([
      'collection_1',
    ]);
  });

  it('deduplicates repeated references', () => {
    const query = queryWithCollectionFilters([
      { collection: 'collection_1' },
      { collection: 'collection_1' },
    ]);

    expect(getQueryCollectionReferences(query).collectionIds).toEqual([
      'collection_1',
    ]);
  });

  it('flags any-collection filters', () => {
    const query = queryWithCollectionFilters([{ source: 'any-collection' }]);

    expect(getQueryCollectionReferences(query)).toEqual({
      collectionIds: [],
      anyCollection: true,
    });
  });
});
