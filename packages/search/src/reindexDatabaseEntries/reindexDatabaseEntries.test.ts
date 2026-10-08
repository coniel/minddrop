import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { rebuildSearchIndex } from '../rebuildSearchIndex';
import { searchFullTextIndex } from '../searchFullTextIndex';
import {
  cleanup,
  seedDatabase,
  seedEntries,
  setup,
  testWorkspaceId,
} from '../test-utils';
import { reindexDatabaseEntries } from './reindexDatabaseEntries';

const workspaceId = testWorkspaceId;

describe('reindexDatabaseEntries', () => {
  beforeEach(() => {
    setup();

    // Seed two databases with entries and build the index
    seedDatabase({ id: 'database-1', name: 'Books' });
    seedDatabase({ id: 'database-2', name: 'Films' });
    seedEntries('database-1', [{ id: 'entry-1', title: 'Dune' }]);
    seedEntries('database-2', [{ id: 'entry-2', title: 'Alien' }]);

    rebuildSearchIndex(workspaceId);
  });

  afterEach(cleanup);

  it('re-indexes entry documents with fresh SQL data', () => {
    // Rename the entry in SQL, then re-index its database
    seedEntries('database-1', [{ id: 'entry-1', title: 'Children of Dune' }]);
    reindexDatabaseEntries(workspaceId, 'database-1');

    const results = searchFullTextIndex(workspaceId, 'children');

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('entry-1');
  });

  it("re-indexes the entries' property values", () => {
    // Give the entry a property value in SQL, then re-index its database
    seedEntries('database-1', [
      {
        id: 'entry-1',
        title: 'Dune',
        properties: [{ name: 'Genre', type: 'select', value: ['Spacefaring'] }],
      },
    ]);
    reindexDatabaseEntries(workspaceId, 'database-1');

    expect(
      searchFullTextIndex(workspaceId, 'spacefaring').map(({ id }) => id),
    ).toEqual(['entry-1']);
  });

  it('refreshes the stored database metadata on entry documents', () => {
    // Rename the database in SQL, then re-index it
    seedDatabase({ id: 'database-1', name: 'Novels' });
    reindexDatabaseEntries(workspaceId, 'database-1');

    const results = searchFullTextIndex(workspaceId, 'dune');

    expect(results[0].databaseName).toBe('Novels');
  });

  it('leaves entries of other databases untouched', () => {
    // Give the other database's entry a property value and index it
    seedEntries('database-2', [
      {
        id: 'entry-2',
        title: 'Alien',
        properties: [{ name: 'Genre', type: 'select', value: ['Xenomorph'] }],
      },
    ]);
    rebuildSearchIndex(workspaceId);

    reindexDatabaseEntries(workspaceId, 'database-1');

    expect(searchFullTextIndex(workspaceId, 'alien')).toHaveLength(1);
    expect(
      searchFullTextIndex(workspaceId, 'xenomorph').map(({ id }) => id),
    ).toEqual(['entry-2']);
  });
});
