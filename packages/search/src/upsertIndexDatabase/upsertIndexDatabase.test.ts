import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { rebuildSearchIndex } from '../rebuildSearchIndex';
import { searchFullTextIndex } from '../searchFullTextIndex';
import { cleanup, seedDatabase, seedEntries, setup } from '../test-utils';
import { upsertIndexDatabase } from './upsertIndexDatabase';

const workspaceId = 'workspace-1';

describe('upsertIndexDatabase', () => {
  beforeEach(async () => {
    setup();

    // Seed a database with an entry and build the index
    seedDatabase({ id: 'database-1', name: 'Books' });
    seedEntries('database-1', [{ id: 'entry-1', title: 'Dune' }]);

    await rebuildSearchIndex(workspaceId);
  });

  afterEach(cleanup);

  it('adds a new database document to the index', () => {
    upsertIndexDatabase({ id: 'database-2', name: 'Films', icon: 'film' });

    const results = searchFullTextIndex(workspaceId, 'films');

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('database-2');
    expect(results[0].type).toBe('database');
  });

  it('replaces an existing database document', () => {
    upsertIndexDatabase({ id: 'database-1', name: 'Novels' });

    // The database is findable under its new name only
    expect(searchFullTextIndex(workspaceId, 'novels')).toHaveLength(1);
    expect(
      searchFullTextIndex(workspaceId, 'books').filter(
        (result) => result.type === 'database',
      ),
    ).toHaveLength(0);
  });
});
