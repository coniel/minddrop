import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { QueriesStore } from '../../QueriesStore';
import { query_1, query_2 } from '../../test-utils';
import { Query } from '../../types';
import { getQueryDatabases } from './getQueryDatabases';

// A query sourcing the given query's results
function querySourcing(query: Query, sourcedQueryId: string): Query {
  return {
    ...query,
    nodes: [
      ...query.nodes.filter((node) => node.type !== 'source'),
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

describe('getQueryDatabases', () => {
  afterEach(() => {
    QueriesStore.clear();
  });

  beforeEach(() => {
    QueriesStore.load([query_1, query_2]);
  });

  it("returns the source nodes' databases", () => {
    expect(getQueryDatabases(query_1)).toEqual(['database_objects']);
  });

  it("resolves a query source to the referenced query's databases", () => {
    // A query whose only source is another query
    const query = querySourcing(query_2, query_1.id);

    expect(getQueryDatabases(query)).toEqual(['database_objects']);
  });

  it('follows query sources recursively', () => {
    // query_3 sources query_2, which sources query_1
    const middle = querySourcing(query_2, query_1.id);
    const outer = querySourcing({ ...query_2, id: 'query_outer' }, middle.id);

    QueriesStore.load([middle]);

    expect(getQueryDatabases(outer)).toEqual(['database_objects']);
  });

  it('ignores a query sourcing itself', () => {
    const query = querySourcing(query_2, query_2.id);

    QueriesStore.load([query]);

    expect(getQueryDatabases(query)).toEqual([]);
  });

  it('stops at reference cycles', () => {
    // Two queries sourcing each other, neither with a database
    const first = querySourcing(
      { ...query_2, id: 'query_first' },
      'query_second',
    );
    const second = querySourcing(
      { ...query_2, id: 'query_second' },
      'query_first',
    );

    QueriesStore.load([first, second]);

    expect(getQueryDatabases(first)).toEqual([]);
  });

  it('ignores references to missing queries', () => {
    const query = querySourcing(query_2, 'query_missing');

    expect(getQueryDatabases(query)).toEqual([]);
  });
});
