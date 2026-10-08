import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MATCH_HIGHLIGHT_END, MATCH_HIGHLIGHT_START } from '../constants';
import { rebuildSearchIndex } from '../rebuildSearchIndex';
import { searchIndexes } from '../searchIndexStore';
import {
  cleanup,
  seedDatabase,
  seedEntries,
  setup,
  testWorkspaceId,
} from '../test-utils';
import { searchContent } from './searchContent';

const workspaceId = testWorkspaceId;

// Wraps text in the highlight markers for expected values
function marked(text: string): string {
  return `${MATCH_HIGHLIGHT_START}${text}${MATCH_HIGHLIGHT_END}`;
}

describe('searchContent', () => {
  beforeEach(() => {
    setup();

    // Seed two databases with entries and build the index
    seedDatabase({ id: 'database-1', name: 'Books', icon: 'book' });
    seedDatabase({ id: 'database-2', name: 'Films', icon: 'film' });
    seedEntries('database-1', [
      {
        id: 'entry-1',
        title: 'Dune',
        properties: [
          { name: 'Content', type: 'content', value: 'Spice must flow' },
          { name: 'Review', type: 'text', value: 'The spice saga' },
        ],
      },
      {
        id: 'entry-2',
        title: 'The Hobbit',
        properties: [
          { name: 'Content', type: 'content', value: 'A hole in the ground' },
        ],
      },
    ]);
    seedEntries('database-2', [
      {
        id: 'entry-3',
        title: 'Dune (1984)',
        properties: [
          { name: 'Content', type: 'content', value: 'Spice and sandworms' },
        ],
      },
    ]);

    rebuildSearchIndex(workspaceId);
  });

  afterEach(cleanup);

  it('searches content without a name index', () => {
    // Drop the workspace's name index
    searchIndexes.clear();

    expect(searchContent(workspaceId, 'hole').map(({ id }) => id)).toEqual([
      'entry-2',
    ]);
  });

  it('returns entries whose content matches the query', () => {
    const results = searchContent(workspaceId, 'hole');

    expect(results).toEqual([
      {
        id: 'entry-2',
        type: 'entry',
        databaseId: 'database-1',
        databaseName: 'Books',
        databaseIcon: 'book',
        title: 'The Hobbit',
        score: expect.any(Number),
        matchedProperties: [
          {
            name: 'Content',
            type: 'content',
            value: `A ${marked('hole')} in the ground`,
          },
        ],
      },
    ]);
  });

  it('highlights the query terms in entry titles', () => {
    // Seed an entry whose title and content both match, and rebuild
    // the index.
    seedEntries('database-1', [
      {
        id: 'entry-4',
        title: 'Hole notes',
        properties: [{ name: 'Content', type: 'content', value: 'hole' }],
      },
    ]);
    rebuildSearchIndex(workspaceId);

    const results = searchContent(workspaceId, 'hole', {
      databaseId: 'database-1',
    });

    expect(results).toContainEqual(
      expect.objectContaining({
        id: 'entry-4',
        title: `${marked('Hole')} notes`,
      }),
    );
  });

  it('groups an entry matching in several properties into one result', () => {
    const results = searchContent(workspaceId, 'spice', {
      databaseId: 'database-1',
    });

    expect(results).toHaveLength(1);
    expect(results[0].matchedProperties.map(({ name }) => name).sort()).toEqual(
      ['Content', 'Review'],
    );
  });

  it('scores more relevant matches higher', () => {
    // Seed an entry mentioning holes more often than the hobbit entry
    seedEntries('database-1', [
      {
        id: 'entry-4',
        title: 'Holes',
        properties: [{ name: 'Content', type: 'content', value: 'hole hole' }],
      },
    ]);
    rebuildSearchIndex(workspaceId);

    const results = searchContent(workspaceId, 'hole');

    expect(results.map(({ id }) => id)).toEqual(['entry-4', 'entry-2']);
    expect(results[0].score).toBeGreaterThan(results[1].score);
  });

  it('returns at most the given number of matching values', () => {
    const results = searchContent(workspaceId, 'spice', { limit: 1 });

    expect(results).toHaveLength(1);
    expect(results[0].matchedProperties).toHaveLength(1);
  });

  it('limits results to the given database', () => {
    const results = searchContent(workspaceId, 'spice', {
      databaseId: 'database-2',
    });

    expect(results.map(({ id }) => id)).toEqual(['entry-3']);
  });

  it('returns entries missing from the name index', () => {
    // Seed an entry without adding it to the name index
    seedEntries('database-1', [
      {
        id: 'entry-5',
        title: 'Unindexed',
        properties: [{ name: 'Content', type: 'content', value: 'burrow' }],
      },
    ]);

    expect(searchContent(workspaceId, 'burrow')).toEqual([
      expect.objectContaining({ id: 'entry-5', title: 'Unindexed' }),
    ]);
  });

  it("returns the database's current name and icon", () => {
    // Rename the database in SQL without updating the name index
    seedDatabase({ id: 'database-1', name: 'Novels', icon: 'novel' });

    expect(searchContent(workspaceId, 'hole')).toEqual([
      expect.objectContaining({
        databaseName: 'Novels',
        databaseIcon: 'novel',
      }),
    ]);
  });
});
