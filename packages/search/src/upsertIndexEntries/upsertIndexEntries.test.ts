import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { rebuildSearchIndex } from '../rebuildSearchIndex';
import { searchFullTextIndex } from '../searchFullTextIndex';
import { searchIndexes } from '../searchIndexStore';
import {
  MockFs,
  cleanup,
  seedDatabase,
  seedEntries,
  setup,
} from '../test-utils';
import { resolveIndexPath } from '../utils';
import { upsertIndexEntries } from './upsertIndexEntries';

const workspaceId = 'workspace-1';

describe('upsertIndexEntries', () => {
  beforeEach(async () => {
    setup();

    // Seed a database with an entry and build the index
    seedDatabase({ id: 'database-1', name: 'Books', icon: 'book' });
    seedEntries('database-1', [{ id: 'entry-1', title: 'Dune' }]);

    await rebuildSearchIndex(workspaceId);
  });

  afterEach(cleanup);

  it('does nothing when no index is initialized', () => {
    // Drop the workspace index so no index exists
    searchIndexes.clear();

    expect(() =>
      upsertIndexEntries([
        { id: 'entry-2', title: 'New', databaseId: 'database-1' },
      ]),
    ).not.toThrow();
  });

  it('adds new entries to the index', () => {
    // Seed the new entry into SQL, then index it
    seedEntries('database-1', [{ id: 'entry-2', title: 'The Hobbit' }]);
    upsertIndexEntries([
      { id: 'entry-2', title: 'The Hobbit', databaseId: 'database-1' },
    ]);

    expect(searchFullTextIndex(workspaceId, 'hobbit')[0].id).toBe('entry-2');
  });

  it('replaces existing entry documents with fresh data', () => {
    // Rename the entry in SQL, then re-index it
    seedEntries('database-1', [{ id: 'entry-1', title: 'Children of Dune' }]);
    upsertIndexEntries([
      { id: 'entry-1', title: 'Children of Dune', databaseId: 'database-1' },
    ]);

    const results = searchFullTextIndex(workspaceId, 'children');

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('entry-1');
  });

  it('persists the index after the debounce delay', async () => {
    vi.useFakeTimers();

    // Drop the index file written by the initial rebuild
    MockFs.reset();

    seedEntries('database-1', [{ id: 'entry-2', title: 'The Hobbit' }]);
    upsertIndexEntries([
      { id: 'entry-2', title: 'The Hobbit', databaseId: 'database-1' },
    ]);

    // Nothing is written until the debounce delay elapses
    expect(MockFs.exists(resolveIndexPath(workspaceId))).toBe(false);

    // Run the debounce timer and the async persist
    await vi.runAllTimersAsync();

    expect(MockFs.exists(resolveIndexPath(workspaceId))).toBe(true);

    vi.useRealTimers();
  });
});
