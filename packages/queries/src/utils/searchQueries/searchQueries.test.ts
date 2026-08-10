import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { QueriesStore } from '../../QueriesStore';
import { queries, query_2 } from '../../test-utils/queries.fixtures';
import { searchQueries } from './searchQueries';

describe('searchQueries', () => {
  beforeEach(() => {
    // Load the test queries into the store
    QueriesStore.load(queries);
  });

  afterEach(() => {
    QueriesStore.clear();
  });

  it('matches queries by name', () => {
    expect(searchQueries('Query 2')).toEqual([query_2]);
  });

  it('matches multiple queries', () => {
    expect(searchQueries('Query')).toEqual(queries);
  });

  it('returns an empty array when nothing matches', () => {
    expect(searchQueries('xyzq')).toEqual([]);
  });
});
