import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { QueriesStore } from '../../QueriesStore';
import { query_1, query_2 } from '../../test-utils';
import { Query } from '../../types';
import { getQueryReferencedQueryIds } from './getQueryReferencedQueryIds';

// A query sourcing the given query's results
function querySourcing(query: Query, sourcedQueryId: string): Query {
  return {
    ...query,
    nodes: [
      ...query.nodes,
      {
        id: `query-node_query-source-${query.id}`,
        type: 'source',
        x: 0,
        y: 0,
        sources: [{ type: 'query', id: sourcedQueryId }],
      },
    ],
  };
}

describe('getQueryReferencedQueryIds', () => {
  beforeEach(() => {
    QueriesStore.load([query_1, query_2]);
  });

  afterEach(() => {
    QueriesStore.clear();
  });

  it('returns an empty array when the query has no query sources', () => {
    expect(getQueryReferencedQueryIds(query_1)).toEqual([]);
  });

  it('returns the referenced query IDs', () => {
    const query = querySourcing(query_2, query_1.id);

    expect(getQueryReferencedQueryIds(query)).toEqual([query_1.id]);
  });

  it('includes queries referenced by referenced queries', () => {
    // query_outer sources query_middle, which sources query_1
    const middle = querySourcing(
      { ...query_2, id: 'query_middle' },
      query_1.id,
    );
    const outer = querySourcing({ ...query_2, id: 'query_outer' }, middle.id);

    QueriesStore.load([middle]);

    expect(getQueryReferencedQueryIds(outer)).toEqual([middle.id, query_1.id]);
  });

  it('ignores a query sourcing itself', () => {
    const query = querySourcing(query_2, query_2.id);

    expect(getQueryReferencedQueryIds(query)).toEqual([]);
  });

  it('stops at reference cycles', () => {
    const first = querySourcing(
      { ...query_2, id: 'query_first' },
      'query_second',
    );
    const second = querySourcing(
      { ...query_2, id: 'query_second' },
      'query_first',
    );

    QueriesStore.load([first, second]);

    expect(getQueryReferencedQueryIds(first)).toEqual(['query_second']);
  });

  it('includes references to missing queries, which may be created later', () => {
    const query = querySourcing(query_2, 'query_missing');

    expect(getQueryReferencedQueryIds(query)).toEqual(['query_missing']);
  });
});
