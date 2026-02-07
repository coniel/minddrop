import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { QueriesStore } from '../QueriesStore';
import {
  MockFs,
  cleanup,
  queries,
  queriesBasePath,
  setup,
} from '../test-utils';
import { initializeQueries } from './initializeQueries';

describe('initializeQueries', () => {
  beforeEach(() => setup({ loadQueries: false }));

  afterEach(cleanup);

  it('loads queries from the queries directory', async () => {
    await initializeQueries();

    expect(QueriesStore.getAll()).toEqual(queries);
  });

  it('creates the queries directory if it does not exist', async () => {
    // Remove the queries directory
    MockFs.removeFile(queriesBasePath);

    await initializeQueries();

    expect(MockFs.exists(queriesBasePath)).toBe(true);
  });
});
