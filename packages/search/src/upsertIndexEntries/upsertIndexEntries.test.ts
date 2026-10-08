import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { rebuildSearchIndex } from '../rebuildSearchIndex';
import { searchFullTextIndex } from '../searchFullTextIndex';
import { searchIndexes } from '../searchIndexStore';
import {
  cleanup,
  seedDatabase,
  seedEntries,
  setup,
  testWorkspaceId,
} from '../test-utils';
import { upsertIndexEntries } from './upsertIndexEntries';

const workspaceId = testWorkspaceId;

describe('upsertIndexEntries', () => {
  beforeEach(() => {
    setup();

    // Seed a database with an entry and build the index
    seedDatabase({ id: 'database-1', name: 'Books', icon: 'book' });
    seedEntries('database-1', [{ id: 'entry-1', title: 'Dune' }]);

    rebuildSearchIndex(workspaceId);
  });

  afterEach(cleanup);

  it('does nothing when no index is initialized', () => {
    // Drop the workspace index so no index exists
    searchIndexes.clear();

    expect(() =>
      upsertIndexEntries(workspaceId, [
        { id: 'entry-2', title: 'New', databaseId: 'database-1' },
      ]),
    ).not.toThrow();
  });

  it("indexes the entries' property values", () => {
    // Seed the new entry with a property value, then index it
    seedEntries('database-1', [
      {
        id: 'entry-2',
        title: 'The Hobbit',
        properties: [{ name: 'Genre', type: 'select', value: ['Spacefaring'] }],
      },
    ]);
    upsertIndexEntries(workspaceId, [
      { id: 'entry-2', title: 'The Hobbit', databaseId: 'database-1' },
    ]);

    expect(
      searchFullTextIndex(workspaceId, 'spacefaring').map(({ id }) => id),
    ).toEqual(['entry-2']);
  });

  it('adds new entries to the index', () => {
    // Seed the new entry into SQL, then index it
    seedEntries('database-1', [{ id: 'entry-2', title: 'The Hobbit' }]);
    upsertIndexEntries(workspaceId, [
      { id: 'entry-2', title: 'The Hobbit', databaseId: 'database-1' },
    ]);

    expect(searchFullTextIndex(workspaceId, 'hobbit')[0].id).toBe('entry-2');
  });

  it('replaces existing entry documents with fresh data', () => {
    // Rename the entry in SQL, then re-index it
    seedEntries('database-1', [{ id: 'entry-1', title: 'Children of Dune' }]);
    upsertIndexEntries(workspaceId, [
      { id: 'entry-1', title: 'Children of Dune', databaseId: 'database-1' },
    ]);

    const results = searchFullTextIndex(workspaceId, 'children');

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('entry-1');
  });
});
