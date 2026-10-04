import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EntriesStore } from '../../EntriesStore';
import { cleanup, objectEntry1, setup } from '../../test-utils';
import { Entry } from '../../types';
import { sortEntryIds } from './sortEntryIds';

// Two entries created a day apart
const older: Entry = {
  ...objectEntry1,
  id: 'database-entry_older',
  created: new Date('2024-01-01T00:00:00.000Z'),
};
const newer: Entry = {
  ...objectEntry1,
  id: 'database-entry_newer',
  created: new Date('2024-01-02T00:00:00.000Z'),
};

describe('sortEntryIds', () => {
  beforeEach(() => {
    setup();

    EntriesStore.load([older, newer]);
  });

  afterEach(cleanup);

  it('sorts the IDs by their entries', () => {
    expect(sortEntryIds([older.id, newer.id])).toEqual([newer.id, older.id]);
  });

  it('appends IDs of other item types', () => {
    expect(sortEntryIds(['collection_1', older.id, newer.id])).toEqual([
      newer.id,
      older.id,
      'collection_1',
    ]);
  });

  it('appends IDs of entries missing from the store', () => {
    expect(
      sortEntryIds(['database-entry_missing', older.id, newer.id]),
    ).toEqual([newer.id, older.id, 'database-entry_missing']);
  });
});
