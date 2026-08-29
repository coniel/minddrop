import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Databases } from '@minddrop/databases';
import { searchFullTextIndex } from '../searchFullTextIndex';
import {
  MockFs,
  cleanup,
  seedDatabase,
  seedEntries,
  setup,
} from '../test-utils';
import { resolveIndexPath } from '../utils';
import { rebuildSearchIndex } from './rebuildSearchIndex';

const workspaceId = 'workspace-1';

describe('rebuildSearchIndex', () => {
  beforeEach(() => {
    setup();

    // Seed a database with entries
    seedDatabase({ id: 'database-1', name: 'Books', icon: 'book' });
    seedEntries('database-1', [
      {
        id: 'entry-1',
        title: 'Dune',
        properties: [
          { name: 'Review', type: 'text', value: 'A masterpiece of satire' },
          { name: 'Link', type: 'url', value: 'https://example.com/dune' },
        ],
      },
    ]);
  });

  afterEach(cleanup);

  it('indexes entries by title', async () => {
    await rebuildSearchIndex(workspaceId);

    expect(searchFullTextIndex(workspaceId, 'dune')[0].id).toBe('entry-1');
  });

  it('indexes entry text content', async () => {
    await rebuildSearchIndex(workspaceId);

    expect(searchFullTextIndex(workspaceId, 'masterpiece')[0].id).toBe(
      'entry-1',
    );
  });

  it('indexes entry property values', async () => {
    await rebuildSearchIndex(workspaceId);

    const results = searchFullTextIndex(workspaceId, 'example.com');

    expect(results[0].id).toBe('entry-1');
  });

  it('indexes databases by name', async () => {
    await rebuildSearchIndex(workspaceId);

    const results = searchFullTextIndex(workspaceId, 'books');

    expect(results[0].id).toBe('database-1');
    expect(results[0].type).toBe('database');
  });

  it('persists the index to disk', async () => {
    await rebuildSearchIndex(workspaceId);

    expect(MockFs.exists(resolveIndexPath(workspaceId))).toBe(true);
  });

  it('replaces a previous index for the workspace', async () => {
    await rebuildSearchIndex(workspaceId);

    // Remove the entry from SQL and rebuild
    Databases.sql.deleteEntries('database-1', ['entry-1'], { silent: true });
    await rebuildSearchIndex(workspaceId);

    // The rebuilt index reflects the fresh SQL state
    expect(searchFullTextIndex(workspaceId, 'dune')).toEqual([]);
  });
});
