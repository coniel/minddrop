import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { rebuildSearchIndex } from '../rebuildSearchIndex';
import { searchFullTextIndex } from '../searchFullTextIndex';
import { cleanup, seedDatabase, seedEntries, setup } from '../test-utils';
import { removeIndexEntries } from './removeIndexEntries';

const workspaceId = 'workspace-1';

describe('removeIndexEntries', () => {
  beforeEach(async () => {
    setup();

    // Seed a database with entries and build the index
    seedDatabase({ id: 'database-1', name: 'Books' });
    seedEntries('database-1', [
      { id: 'entry-1', title: 'Dune' },
      { id: 'entry-2', title: 'Dune Messiah' },
    ]);

    await rebuildSearchIndex(workspaceId);
  });

  afterEach(cleanup);

  it('removes the entries from the index', () => {
    removeIndexEntries(['entry-1', 'entry-2']);

    expect(searchFullTextIndex(workspaceId, 'dune')).toEqual([]);
  });

  it('leaves other entries indexed', () => {
    removeIndexEntries(['entry-1']);

    const results = searchFullTextIndex(workspaceId, 'dune');

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('entry-2');
  });

  it('ignores unknown entry IDs', () => {
    expect(() => removeIndexEntries(['unknown-entry'])).not.toThrow();
  });
});
