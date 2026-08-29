import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { rebuildSearchIndex } from '../rebuildSearchIndex';
import { searchFullTextIndex } from '../searchFullTextIndex';
import { cleanup, seedDatabase, seedEntries, setup } from '../test-utils';
import { reindexDatabaseEntries } from './reindexDatabaseEntries';

const workspaceId = 'workspace-1';

describe('reindexDatabaseEntries', () => {
  beforeEach(async () => {
    setup();

    // Seed two databases with entries and build the index
    seedDatabase({ id: 'database-1', name: 'Books' });
    seedDatabase({ id: 'database-2', name: 'Films' });
    seedEntries('database-1', [{ id: 'entry-1', title: 'Dune' }]);
    seedEntries('database-2', [{ id: 'entry-2', title: 'Alien' }]);

    await rebuildSearchIndex(workspaceId);
  });

  afterEach(cleanup);

  it('re-indexes entry documents with fresh SQL data', () => {
    // Rename the entry in SQL, then re-index its database
    seedEntries('database-1', [{ id: 'entry-1', title: 'Children of Dune' }]);
    reindexDatabaseEntries('database-1');

    const results = searchFullTextIndex(workspaceId, 'children');

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('entry-1');
  });

  it('refreshes the stored database metadata on entry documents', () => {
    // Rename the database in SQL, then re-index it
    seedDatabase({ id: 'database-1', name: 'Novels' });
    reindexDatabaseEntries('database-1');

    const results = searchFullTextIndex(workspaceId, 'dune');

    expect(results[0].databaseName).toBe('Novels');
  });

  it('leaves entries of other databases untouched', () => {
    reindexDatabaseEntries('database-1');

    expect(searchFullTextIndex(workspaceId, 'alien')).toHaveLength(1);
  });
});
