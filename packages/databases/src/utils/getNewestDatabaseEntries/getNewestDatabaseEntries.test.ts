import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import {
  cleanup,
  objectDatabase,
  objectEntry1,
  setup,
  urlEntry1,
} from '../../test-utils';
import { DatabaseEntry } from '../../types';
import { getNewestDatabaseEntries } from './getNewestDatabaseEntries';

// Entries with distinct creation dates, newer than the fixture
// entries
const middleEntry: DatabaseEntry = {
  ...objectEntry1,
  id: 'database-entry_middle',
  created: new Date('2026-02-01T00:00:00.000Z'),
};
const newestEntry: DatabaseEntry = {
  ...urlEntry1,
  id: 'database-entry_newest',
  created: new Date('2026-03-01T00:00:00.000Z'),
};

describe('getNewestDatabaseEntries', () => {
  beforeEach(() => {
    setup();

    // Load extra entries with distinct creation dates
    DatabaseEntriesStore.load([middleEntry, newestEntry]);
  });

  afterEach(cleanup);

  it('sorts entries by creation date descending', () => {
    expect(getNewestDatabaseEntries(2)).toEqual([newestEntry, middleEntry]);
  });

  it('limits the number of returned entries', () => {
    expect(getNewestDatabaseEntries(1)).toEqual([newestEntry]);
  });

  it('filters entries by database', () => {
    expect(getNewestDatabaseEntries(1, [objectDatabase.id])).toEqual([
      middleEntry,
    ]);
  });
});
