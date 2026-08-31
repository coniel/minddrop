import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseEntriesStore } from '../../DatabaseEntriesStore';
import { cleanup, objectEntry1, setup } from '../../test-utils';
import { DatabaseEntry } from '../../types';
import { sortDatabaseEntryIds } from './sortDatabaseEntryIds';

// Two entries created a day apart
const older: DatabaseEntry = {
  ...objectEntry1,
  id: 'database-entry_older',
  created: new Date('2024-01-01T00:00:00.000Z'),
};
const newer: DatabaseEntry = {
  ...objectEntry1,
  id: 'database-entry_newer',
  created: new Date('2024-01-02T00:00:00.000Z'),
};

describe('sortDatabaseEntryIds', () => {
  beforeEach(() => {
    setup();

    DatabaseEntriesStore.load([older, newer]);
  });

  afterEach(cleanup);

  it('sorts the IDs by their entries', () => {
    expect(sortDatabaseEntryIds([older.id, newer.id])).toEqual([
      newer.id,
      older.id,
    ]);
  });

  it('appends IDs of other item types', () => {
    expect(sortDatabaseEntryIds(['collection_1', older.id, newer.id])).toEqual([
      newer.id,
      older.id,
      'collection_1',
    ]);
  });

  it('appends IDs of entries missing from the store', () => {
    expect(
      sortDatabaseEntryIds(['database-entry_missing', older.id, newer.id]),
    ).toEqual([newer.id, older.id, 'database-entry_missing']);
  });
});
