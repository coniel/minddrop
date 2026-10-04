import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EntriesStore } from '../../EntriesStore';
import {
  cleanup,
  objectDatabase,
  objectEntry1,
  setup,
  urlEntry1,
} from '../../test-utils';
import { Entry } from '../../types';
import { getRecentEntries } from './getRecentEntries';

// Entries with distinct modification dates, more recent than the
// fixture entries.
const middleEntry: Entry = {
  ...objectEntry1,
  id: 'database-entry_middle',
  lastModified: new Date('2026-02-01T00:00:00.000Z'),
};
const recentEntry: Entry = {
  ...urlEntry1,
  id: 'database-entry_recent',
  lastModified: new Date('2026-03-01T00:00:00.000Z'),
};

describe('getRecentEntries', () => {
  beforeEach(() => {
    setup();

    // Load extra entries with distinct modification dates
    EntriesStore.load([middleEntry, recentEntry]);
  });

  afterEach(cleanup);

  it('sorts entries by modification date descending', () => {
    expect(getRecentEntries(2)).toEqual([recentEntry, middleEntry]);
  });

  it('limits the number of returned entries', () => {
    expect(getRecentEntries(1)).toEqual([recentEntry]);
  });

  it('filters entries by database', () => {
    expect(getRecentEntries(1, { databases: [objectDatabase.id] })).toEqual([
      middleEntry,
    ]);
  });

  it('leaves out the excluded entries', () => {
    expect(getRecentEntries(1, { exclude: [recentEntry.id] })).toEqual([
      middleEntry,
    ]);
  });

  it('fills the limit around the excluded entries', () => {
    expect(getRecentEntries(2, { exclude: [recentEntry.id] })).toHaveLength(2);
  });
});
