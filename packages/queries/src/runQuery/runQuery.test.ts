import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DatabaseFixtures, Databases } from '@minddrop/databases';
import { QueriesStore } from '../QueriesStore';
import { cleanup, setup } from '../test-utils';
import { query_1 } from '../test-utils/queries.fixtures';
import { runQuery } from './runQuery';

const { objectDatabase } = DatabaseFixtures;

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
        queryEntries: () => ['database-entry_1', 'database-entry_2'],
      },
    },
  };
});

describe('runQuery', () => {
  beforeEach(() => {
    setup({});

    // Load the query's source database
    Databases.Store.load([objectDatabase]);
  });

  afterEach(() => {
    Databases.Store.clear();
    cleanup();
  });

  it('returns the matching entry IDs', async () => {
    await expect(runQuery(query_1.id)).resolves.toEqual([
      'database-entry_1',
      'database-entry_2',
    ]);
  });

  it('returns an empty array when the query does not exist', async () => {
    await expect(runQuery('missing')).resolves.toEqual([]);
  });

  it('returns an empty array when the query has no source database', async () => {
    // A query without a selected source database
    QueriesStore.set({ ...query_1, database: '' });

    await expect(runQuery(query_1.id)).resolves.toEqual([]);
  });

  it('returns an empty array when the source database no longer exists', async () => {
    // A query referencing a deleted database
    QueriesStore.set({ ...query_1, database: 'database_missing' });

    await expect(runQuery(query_1.id)).resolves.toEqual([]);
  });
});
