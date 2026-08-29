import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Sql } from '@minddrop/sql';
import { rebuildSearchIndex } from '../rebuildSearchIndex';
import { searchFullTextIndex } from '../searchFullTextIndex';
import { searchIndexes } from '../searchIndexStore';
import { cleanup, seedDatabase, seedEntries, setup } from '../test-utils';
import { initializeSearchIndex } from './initializeSearchIndex';

const workspaceId = 'workspace-1';

describe('initializeSearchIndex', () => {
  beforeEach(() => {
    setup();

    // Seed a database with an entry
    seedDatabase({ id: 'database-1', name: 'Books' });
    seedEntries('database-1', [{ id: 'entry-1', title: 'Dune' }]);
  });

  afterEach(cleanup);

  it('builds the index from SQL when no persisted index exists', async () => {
    await initializeSearchIndex(workspaceId);

    expect(searchFullTextIndex(workspaceId, 'dune')[0].id).toBe('entry-1');
  });

  it('loads the persisted index when its version matches', async () => {
    // Build and persist an index, then drop the in-memory copy
    await rebuildSearchIndex(workspaceId);
    searchIndexes.clear();

    // Remove the entry via raw SQL, leaving the version counter
    // untouched; a rebuild would now produce an empty index
    Sql.run('DELETE FROM entries WHERE id = ?', 'entry-1');

    await initializeSearchIndex(workspaceId);

    // The entry is still findable, proving the index came from
    // disk rather than a rebuild
    expect(searchFullTextIndex(workspaceId, 'dune')).toHaveLength(1);
  });

  it('rebuilds from SQL when the persisted version mismatches', async () => {
    // Build and persist an index, then drop the in-memory copy
    await rebuildSearchIndex(workspaceId);
    searchIndexes.clear();

    // Change SQL data, bumping the version counter
    seedEntries('database-1', [{ id: 'entry-2', title: 'The Hobbit' }]);

    await initializeSearchIndex(workspaceId);

    // The new entry is only findable via a fresh rebuild
    expect(searchFullTextIndex(workspaceId, 'hobbit')).toHaveLength(1);
  });
});
