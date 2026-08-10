import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EntryQueryScope } from '@minddrop/databases';
import { cleanup, setup } from '../test-utils';
import { query_1 } from '../test-utils/queries.fixtures';
import { runQueryNode } from './runQueryNode';

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

describe('runQueryNode', () => {
  beforeEach(() => {
    setup({});
  });

  afterEach(cleanup);

  it("returns the entry IDs flowing out of the node's output", async () => {
    await expect(
      runQueryNode(query_1.id, query_1.nodes[1].id),
    ).resolves.toEqual(['database-entry_1', 'database-entry_2']);
  });

  it('returns an empty array when the query does not exist', async () => {
    await expect(runQueryNode('missing', query_1.nodes[1].id)).resolves.toEqual(
      [],
    );
  });

  it('returns an empty array when the node does not exist', async () => {
    await expect(runQueryNode(query_1.id, 'missing')).resolves.toEqual([]);
  });
});
