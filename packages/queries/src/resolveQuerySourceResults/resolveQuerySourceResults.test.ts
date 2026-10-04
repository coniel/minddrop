import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EntryQueryScope } from '@minddrop/databases';
import { QueriesStore } from '../QueriesStore';
import { cleanup, setup } from '../test-utils';
import { query_1, query_2 } from '../test-utils/queries.fixtures';
import { Query } from '../types';
import { resolveQuerySourceResults } from './resolveQuerySourceResults';

// Mock SQL query execution, the query builder is tested in the
// databases package against a real database.
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
    nodes: query.nodes.map((node) =>
      node.type === 'source'
        ? { ...node, source: { type: 'query', id: sourcedQueryId } }
        : node,
    ),
  };
}

describe('resolveQuerySourceResults', () => {
  beforeEach(() => {
    setup({});
  });

  afterEach(cleanup);

  it('returns null when the source is a database', async () => {
    await expect(resolveQuerySourceResults(query_1)).resolves.toBeNull();
  });

  it("returns the referenced query's results", async () => {
    const query = querySourcing(query_2, query_1.id);

    await expect(resolveQuerySourceResults(query)).resolves.toEqual([
      'database-entry_1',
      'database-entry_2',
    ]);
  });

  it("resolves the sourced query's own source", async () => {
    const middle = querySourcing(
      { ...query_2, id: 'query_middle' },
      query_1.id,
    );
    const outer = querySourcing({ ...query_2, id: 'query_outer' }, middle.id);

    QueriesStore.load([middle]);

    // The middle query resolves through to the first query's
    // database, so it returns entries rather than nothing.
    await expect(resolveQuerySourceResults(outer)).resolves.toEqual([
      'database-entry_1',
      'database-entry_2',
    ]);
  });

  it('returns null for a query sourcing itself', async () => {
    const query = querySourcing(query_2, query_2.id);

    QueriesStore.load([query]);

    await expect(resolveQuerySourceResults(query)).resolves.toBeNull();
  });

  it('resolves a source cycle to no results', async () => {
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
    // database source of its own, so it matches nothing.
    await expect(resolveQuerySourceResults(first)).resolves.toEqual([]);
  });

  it('returns null when the sourced query is missing', async () => {
    const query = querySourcing(query_2, 'query_missing');

    await expect(resolveQuerySourceResults(query)).resolves.toBeNull();
  });
});
