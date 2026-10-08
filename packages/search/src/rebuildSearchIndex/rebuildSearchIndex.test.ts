import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Databases } from '@minddrop/databases';
import { searchFullTextIndex } from '../searchFullTextIndex';
import { searchIndexes } from '../searchIndexStore';
import {
  cleanup,
  seedDatabase,
  seedEntries,
  setup,
  testWorkspaceId,
} from '../test-utils';
import { rebuildSearchIndex } from './rebuildSearchIndex';

const workspaceId = testWorkspaceId;

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

  it('indexes entries by title', () => {
    rebuildSearchIndex(workspaceId);

    expect(searchFullTextIndex(workspaceId, 'dune')[0].id).toBe('entry-1');
  });

  it('leaves entry text content out of the index', () => {
    rebuildSearchIndex(workspaceId);

    const index = searchIndexes.get(workspaceId);

    expect(index).toBeDefined();
    expect(index!.search('masterpiece')).toEqual([]);
  });

  it('indexes entry property values', () => {
    rebuildSearchIndex(workspaceId);

    const results = searchFullTextIndex(workspaceId, 'example.com');

    expect(results[0].id).toBe('entry-1');
  });

  it('indexes databases by name', () => {
    rebuildSearchIndex(workspaceId);

    const results = searchFullTextIndex(workspaceId, 'books');

    expect(results[0].id).toBe('database-1');
    expect(results[0].type).toBe('database');
  });

  it('replaces a previous index for the workspace', () => {
    rebuildSearchIndex(workspaceId);

    // Remove the entry from SQL and rebuild
    Databases.sql.deleteEntries(
      'database-1',
      ['entry-1'],
      { silent: true },
      workspaceId,
    );
    rebuildSearchIndex(workspaceId);

    // The rebuilt index reflects the fresh SQL state
    expect(searchFullTextIndex(workspaceId, 'dune')).toEqual([]);
  });
});
