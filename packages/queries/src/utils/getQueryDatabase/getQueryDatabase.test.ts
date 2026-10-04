import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { QueriesStore } from '../../QueriesStore';
import { query_1, query_2 } from '../../test-utils';
import { Query, QuerySourceReference } from '../../types';
import { getQueryDatabase } from './getQueryDatabase';

// A copy of the query with its source node pointed at the given
// source.
function withSource(query: Query, source: QuerySourceReference): Query {
  return {
    ...query,
    nodes: query.nodes.map((node) =>
      node.type === 'source' ? { ...node, source } : node,
    ),
  };
}

describe('getQueryDatabase', () => {
  afterEach(() => {
    QueriesStore.clear();
  });

  beforeEach(() => {
    QueriesStore.load([query_1, query_2]);
  });

  it("returns a database source's database", () => {
    expect(getQueryDatabase(query_1)).toBe('database_objects');
  });

  it('returns null when no source is picked', () => {
    const query = withSource(query_1, { type: 'database', id: '' });

    expect(getQueryDatabase(query)).toBeNull();
  });

  it("resolves a query source to the sourced query's database", () => {
    const query = withSource(query_2, { type: 'query', id: query_1.id });

    expect(getQueryDatabase(query)).toBe('database_objects');
  });

  it('follows query sources recursively', () => {
    // outer sources middle, which sources query_1
    const middle = withSource(query_2, { type: 'query', id: query_1.id });
    const outer = withSource(
      { ...query_2, id: 'query_outer' },
      { type: 'query', id: middle.id },
    );

    QueriesStore.load([middle]);

    expect(getQueryDatabase(outer)).toBe('database_objects');
  });

  it('returns null for a query sourcing itself', () => {
    const query = withSource(query_2, { type: 'query', id: query_2.id });

    QueriesStore.load([query]);

    expect(getQueryDatabase(query)).toBeNull();
  });

  it('returns null for a source cycle', () => {
    // Two queries sourcing each other, neither with a database
    const first = withSource(
      { ...query_2, id: 'query_first' },
      { type: 'query', id: 'query_second' },
    );
    const second = withSource(
      { ...query_2, id: 'query_second' },
      { type: 'query', id: 'query_first' },
    );

    QueriesStore.load([first, second]);

    expect(getQueryDatabase(first)).toBeNull();
  });

  it('returns null when the sourced query is missing', () => {
    const query = withSource(query_2, { type: 'query', id: 'query_missing' });

    expect(getQueryDatabase(query)).toBeNull();
  });
});
