import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { QueriesStore } from '../QueriesStore';
import { cleanup, queries, setup } from '../test-utils';
import { loadQueries } from './loadQueries';

describe('loadQueries', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('loads the query configs into the store', async () => {
    await loadQueries(queries.map((query) => query.path));

    expect(QueriesStore.getAll()).toEqual(queries);
  });
});
