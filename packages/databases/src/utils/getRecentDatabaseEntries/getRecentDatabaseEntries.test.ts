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
import { getRecentDatabaseEntries } from './getRecentDatabaseEntries';

// Entries with distinct modification dates, more recent than the
// fixture entries
const middleEntry: DatabaseEntry = {
  ...objectEntry1,
  id: 'database-entry_middle',
  lastModified: new Date('2026-02-01T00:00:00.000Z'),
};
const recentEntry: DatabaseEntry = {
  ...urlEntry1,
  id: 'database-entry_recent',
  lastModified: new Date('2026-03-01T00:00:00.000Z'),
};

describe('getRecentDatabaseEntries', () => {
  beforeEach(() => {
    setup();

    // Load extra entries with distinct modification dates
    DatabaseEntriesStore.load([middleEntry, recentEntry]);
  });

  afterEach(cleanup);

  it('sorts entries by modification date descending', () => {
    expect(getRecentDatabaseEntries(2)).toEqual([recentEntry, middleEntry]);
  });

  it('limits the number of returned entries', () => {
    expect(getRecentDatabaseEntries(1)).toEqual([recentEntry]);
  });

  it('filters entries by database', () => {
    expect(getRecentDatabaseEntries(1, [objectDatabase.id])).toEqual([
      middleEntry,
    ]);
  });
});
