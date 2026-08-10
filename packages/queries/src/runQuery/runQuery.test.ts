import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EntryQueryScope } from '@minddrop/databases';
import { QueriesStore } from '../QueriesStore';
import { cleanup, setup } from '../test-utils';
import { query_1 } from '../test-utils/queries.fixtures';
import { runQuery } from './runQuery';

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

describe('runQuery', () => {
  beforeEach(() => {
    setup({});
  });

  afterEach(cleanup);

  it('returns the matching entry IDs', async () => {
    await expect(runQuery(query_1.id)).resolves.toEqual([
      'database-entry_1',
      'database-entry_2',
    ]);
  });

  it('returns an empty array when the query does not exist', async () => {
    await expect(runQuery('missing')).resolves.toEqual([]);
  });

  it('returns an empty array when no source reaches the results node', async () => {
    // A query graph containing only its results node
    QueriesStore.set({
      ...query_1,
      nodes: query_1.nodes.filter((node) => node.type === 'results'),
      connections: [],
    });

    await expect(runQuery(query_1.id)).resolves.toEqual([]);
  });
});
