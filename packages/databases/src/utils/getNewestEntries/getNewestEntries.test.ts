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
import { getNewestEntries } from './getNewestEntries';

// Entries with distinct creation dates, newer than the fixture
// entries.
const middleEntry: Entry = {
  ...objectEntry1,
  id: 'database-entry_middle',
  created: new Date('2026-02-01T00:00:00.000Z'),
};
const newestEntry: Entry = {
  ...urlEntry1,
  id: 'database-entry_newest',
  created: new Date('2026-03-01T00:00:00.000Z'),
};

describe('getNewestEntries', () => {
  beforeEach(() => {
    setup();

    // Load extra entries with distinct creation dates
    EntriesStore.load([middleEntry, newestEntry]);
  });

  afterEach(cleanup);

  it('sorts entries by creation date descending', () => {
    expect(getNewestEntries(2)).toEqual([newestEntry, middleEntry]);
  });

  it('limits the number of returned entries', () => {
    expect(getNewestEntries(1)).toEqual([newestEntry]);
  });

  it('filters entries by database', () => {
    expect(getNewestEntries(1, [objectDatabase.id])).toEqual([middleEntry]);
  });
});
