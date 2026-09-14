import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabasesStore } from '../../DatabasesStore';
import { cleanup, objectDatabase, setup } from '../../test-utils';
import { Database } from '../../types';
import { getRecentDatabases } from './getRecentDatabases';

// Databases with distinct creation dates, newer than the ones
// the fixtures carry.
const middleDatabase: Database = {
  ...objectDatabase,
  id: 'database_middle',
  created: new Date('2026-02-01T00:00:00.000Z'),
};
const newestDatabase: Database = {
  ...objectDatabase,
  id: 'database_newest',
  created: new Date('2026-03-01T00:00:00.000Z'),
};

describe('getRecentDatabases', () => {
  beforeEach(() => {
    setup();

    // Load extra databases with distinct creation dates
    DatabasesStore.load([middleDatabase, newestDatabase]);
  });

  afterEach(cleanup);

  it('sorts the databases by creation date, newest first', () => {
    expect(getRecentDatabases(2)).toEqual([newestDatabase, middleDatabase]);
  });

  it('returns no more databases than the limit', () => {
    expect(getRecentDatabases(1)).toEqual([newestDatabase]);
  });
});
