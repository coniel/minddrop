import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { rebuildSearchIndex } from '../rebuildSearchIndex';
import { searchFullTextIndex } from '../searchFullTextIndex';
import { cleanup, seedDatabase, setup, testWorkspaceId } from '../test-utils';
import { removeIndexDatabase } from './removeIndexDatabase';

const workspaceId = testWorkspaceId;

describe('removeIndexDatabase', () => {
  beforeEach(async () => {
    setup();

    // Seed a database and build the index
    seedDatabase({ id: 'database-1', name: 'Books' });

    await rebuildSearchIndex(workspaceId);
  });

  afterEach(cleanup);

  it('removes the database document from the index', () => {
    removeIndexDatabase(workspaceId, 'database-1');

    expect(searchFullTextIndex(workspaceId, 'books')).toEqual([]);
  });

  it('ignores unknown database IDs', () => {
    expect(() =>
      removeIndexDatabase(workspaceId, 'unknown-database'),
    ).not.toThrow();
  });
});
