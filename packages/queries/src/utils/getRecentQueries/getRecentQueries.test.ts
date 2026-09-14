import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { QueriesStore } from '../../QueriesStore';
import { cleanup, query_1, setup } from '../../test-utils';
import { Query } from '../../types';
import { getRecentQueries } from './getRecentQueries';

// Queries with distinct creation dates, newer than the ones
// the fixtures carry.
const middleQuery: Query = {
  ...query_1,
  id: 'query_middle',
  created: new Date('2026-02-01T00:00:00.000Z'),
};
const newestQuery: Query = {
  ...query_1,
  id: 'query_newest',
  created: new Date('2026-03-01T00:00:00.000Z'),
};

describe('getRecentQueries', () => {
  beforeEach(() => {
    setup({ loadQueries: true });

    // Load extra queries with distinct creation dates
    QueriesStore.load([middleQuery, newestQuery]);
  });

  afterEach(cleanup);

  it('sorts the queries by creation date, newest first', () => {
    expect(getRecentQueries(2)).toEqual([newestQuery, middleQuery]);
  });

  it('returns no more queries than the limit', () => {
    expect(getRecentQueries(1)).toEqual([newestQuery]);
  });
});
