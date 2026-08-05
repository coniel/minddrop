import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  cleanup,
  objectDatabase,
  objectEntry1,
  relatedEntry1,
  relatedEntry2,
  setup,
} from '../../test-utils';
import { searchDatabaseEntriesByTitle } from './searchDatabaseEntriesByTitle';

describe('searchDatabaseEntriesByTitle', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns entries with fuzzy matching titles', () => {
    expect(searchDatabaseEntriesByTitle('Related')).toEqual([
      relatedEntry1,
      relatedEntry2,
    ]);
  });

  it('returns distinct entries for duplicate titles', () => {
    // Three fixture entries share the title "Test Entry"
    const result = searchDatabaseEntriesByTitle('Test Entry');

    expect(result).toHaveLength(3);
    expect(new Set(result.map((entry) => entry.id)).size).toBe(3);
  });

  it('filters entries by database', () => {
    expect(
      searchDatabaseEntriesByTitle('Test Entry', [objectDatabase.id]),
    ).toEqual([objectEntry1]);
  });

  it('returns an empty array when nothing matches', () => {
    expect(searchDatabaseEntriesByTitle('xyzq')).toEqual([]);
  });
});
