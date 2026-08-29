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

  it('ranks title matches above property value matches', async () => {
    // Seed an entry whose title matches the query and one which
    // only matches via a property value
    seedEntries('database-1', [
      { id: 'entry-5', title: 'Databases' },
      {
        id: 'entry-6',
        title: 'data-view-owner',
        properties: [
          {
            name: 'Packages',
            type: 'select',
            value: ['databases', 'feature-databases'],
          },
        ],
      },
    ]);

    await rebuildSearchIndex(workspaceId);

    const results = searchFullTextIndex(workspaceId, 'databa');

    // The title match ranks above the property value match
    const titleMatchIndex = results.findIndex(
      (result) => result.id === 'entry-5',
    );
    const propertyMatchIndex = results.findIndex(
      (result) => result.id === 'entry-6',
    );

    expect(titleMatchIndex).not.toBe(-1);
    expect(propertyMatchIndex).not.toBe(-1);
    expect(titleMatchIndex).toBeLessThan(propertyMatchIndex);
  });

  it('ranks whole-title matches above accumulated field matches', async () => {
    // Seed an entry whose title is the match and one which
    // matches in its title, content, and property values
    seedEntries('database-1', [
      { id: 'entry-7', title: 'Spaces' },
      {
        id: 'entry-8',
        title: 'views-in-spaces',
        properties: [
          {
            name: 'Packages',
            type: 'select',
            value: ['spaces', 'feature-spaces'],
          },
          {
            name: 'Notes',
            type: 'text',
            value: 'notes about how spaces embed views',
          },
        ],
      },
    ]);

    await rebuildSearchIndex(workspaceId);

    const results = searchFullTextIndex(workspaceId, 'space');

    // The whole-title match ranks above the multi-field match
    const wholeTitleIndex = results.findIndex(
      (result) => result.id === 'entry-7',
    );
    const multiFieldIndex = results.findIndex(
      (result) => result.id === 'entry-8',
    );

    expect(wholeTitleIndex).not.toBe(-1);
    expect(multiFieldIndex).not.toBe(-1);
    expect(wholeTitleIndex).toBeLessThan(multiFieldIndex);
  });

  it('ranks title matches above matches in other fields only', async () => {
    // Seed an entry which only matches via a property value
    seedEntries('database-1', [
      { id: 'entry-9', title: 'Groceries' },
      {
        id: 'entry-10',
        title: 'Reading list',
        properties: [
          { name: 'Packages', type: 'select', value: ['groceries'] },
        ],
      },
    ]);

    await rebuildSearchIndex(workspaceId);

    const results = searchFullTextIndex(workspaceId, 'groceries');

    // The title match ranks first
    expect(results[0].id).toBe('entry-9');
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
