import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EntryQueryScope } from '@minddrop/databases';
import { QueriesStore } from '../QueriesStore';
import { cleanup, setup } from '../test-utils';
import { query_1, query_2 } from '../test-utils/queries.fixtures';
import { Query } from '../types';
import { resolveQuerySourceResults } from './resolveQuerySourceResults';

// Mock SQL query execution, the query builder is tested in the
// databases package against a real database
vi.mock('@minddrop/databases', async (importOriginal) => {
  const original = await importOriginal<typeof import('@minddrop/databases')>();

  return {
    ...original,
    Databases: {
      ...original.Databases,
      sql: {
        ...original.Databases.sql,
        queryScopedEntries: (scopes: EntryQueryScope[]) =>
          scopes.length > 0 ? ['database-entry_1', 'database-entry_2'] : [],
      },
    },
  };
});

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
    connections: [
      {
        id: `query-connection_query-source-${query.id}`,
        from: `query-node_query-source-${query.id}`,
        to: query.nodes[query.nodes.length - 1].id,
      },
    ],
  };
}

describe('resolveQuerySourceResults', () => {
  beforeEach(() => {
    setup({});
  });

  afterEach(cleanup);

  it('returns no results when the query has no query sources', async () => {
    await expect(resolveQuerySourceResults(query_1)).resolves.toEqual({});
  });

  it("returns the referenced query's results", async () => {
    const query = querySourcing(query_2, query_1.id);

    await expect(resolveQuerySourceResults(query)).resolves.toEqual({
      [query_1.id]: ['database-entry_1', 'database-entry_2'],
    });
  });

  it('resolves references of referenced queries', async () => {
    const middle = querySourcing(
      { ...query_2, id: 'query_middle' },
      query_1.id,
    );
    const outer = querySourcing({ ...query_2, id: 'query_outer' }, middle.id);

    QueriesStore.load([middle]);

    // The middle query resolves through to the first query's
    // databases, so it returns entries rather than nothing
    await expect(resolveQuerySourceResults(outer)).resolves.toEqual({
      [middle.id]: ['database-entry_1', 'database-entry_2'],
    });
  });

  it('resolves a query sourcing itself to no results', async () => {
    const query = querySourcing(query_2, query_2.id);

    QueriesStore.load([query]);

    await expect(resolveQuerySourceResults(query)).resolves.toEqual({});
  });

  it('resolves reference cycles to no further results', async () => {
    const first = querySourcing(
      { ...query_2, id: 'query_first' },
      'query_second',
    );
    const second = querySourcing(
      { ...query_2, id: 'query_second' },
      'query_first',
    );

    QueriesStore.load([first, second]);

    // The cycle closes on the second query, which has no
    // database source of its own, so it matches nothing
    await expect(resolveQuerySourceResults(first)).resolves.toEqual({
      query_second: [],
    });
  });

  it('skips references to missing queries', async () => {
    const query = querySourcing(query_2, 'query_missing');

    await expect(resolveQuerySourceResults(query)).resolves.toEqual({});
  });
});
