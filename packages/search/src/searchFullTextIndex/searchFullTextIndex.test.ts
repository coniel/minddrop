import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { MATCH_HIGHLIGHT_END, MATCH_HIGHLIGHT_START } from '../constants';
import { rebuildSearchIndex } from '../rebuildSearchIndex';
import { cleanup, seedDatabase, seedEntries, setup } from '../test-utils';
import { searchFullTextIndex } from './searchFullTextIndex';

const workspaceId = 'workspace-1';

// Wraps text in the highlight markers for expected values
function marked(text: string): string {
  return `${MATCH_HIGHLIGHT_START}${text}${MATCH_HIGHLIGHT_END}`;
}

describe('searchFullTextIndex', () => {
  beforeEach(async () => {
    setup();

    // Seed two databases with entries and build the index
    seedDatabase({ id: 'database-1', name: 'Books', icon: 'book' });
    seedDatabase({ id: 'database-2', name: 'Films', icon: 'film' });
    seedEntries('database-1', [
      {
        id: 'entry-1',
        title: 'Dune',
        properties: [{ name: 'Author', type: 'text', value: 'Frank Herbert' }],
      },
      { id: 'entry-2', title: 'Dune Messiah' },
      { id: 'entry-3', title: 'The Hobbit' },
    ]);
    seedEntries('database-2', [{ id: 'entry-4', title: 'Dune (1984)' }]);

    await rebuildSearchIndex(workspaceId);
  });

  afterEach(cleanup);

  it('returns an empty list when the workspace has no index', () => {
    expect(searchFullTextIndex('other-workspace', 'dune')).toEqual([]);
  });

  it('finds entries matching the query', () => {
    const results = searchFullTextIndex(workspaceId, 'hobbit');

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('entry-3');
    expect(results[0].type).toBe('entry');
  });

  it('returns the owning database metadata on entry results', () => {
    const results = searchFullTextIndex(workspaceId, 'hobbit');

    expect(results[0].databaseId).toBe('database-1');
    expect(results[0].databaseName).toBe('Books');
    expect(results[0].databaseIcon).toBe('book');
  });

  it('limits the number of results', () => {
    const results = searchFullTextIndex(workspaceId, 'dune', 2);

    expect(results).toHaveLength(2);
  });

  it('scopes the search to a database when specified', () => {
    const results = searchFullTextIndex(workspaceId, 'dune', 20, 'database-2');

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('entry-4');
  });

  it('highlights the matched term in entry titles', () => {
    const results = searchFullTextIndex(workspaceId, 'hobbit');

    expect(results[0].title).toBe(`The ${marked('Hobbit')}`);
  });

  it('returns database results with the db: prefix stripped', () => {
    const results = searchFullTextIndex(workspaceId, 'books');

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('database-1');
    expect(results[0].type).toBe('database');
    expect(results[0].title).toBe('Books');
  });

  it('returns matched properties with highlight markers', () => {
    const results = searchFullTextIndex(workspaceId, 'herbert');

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('entry-1');
    expect(results[0].matchedProperties).toEqual([
      {
        name: 'Author',
        type: 'text',
        value: `Frank ${marked('Herbert')}`,
      },
    ]);
  });
});
