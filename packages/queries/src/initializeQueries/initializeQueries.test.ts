import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { QueriesStore } from '../QueriesStore';
import { QueriesLoadedEvent } from '../events';
import { MockFs, cleanup, queries, setup } from '../test-utils';
import { getQueriesDirPath, getQueryFilePath } from '../utils';
import { initializeQueries } from './initializeQueries';

describe('initializeQueries', () => {
  beforeEach(() => setup({ loadQueries: false }));

  afterEach(cleanup);

  it('creates the queries directory if it does not exist', async () => {
    // Remove the queries directory
    MockFs.removeFile(getQueriesDirPath());

    await initializeQueries();

    expect(MockFs.exists(getQueriesDirPath())).toBe(true);
  });

  it('loads queries from the queries directory into the store', async () => {
    await initializeQueries();

    expect(QueriesStore.getAll()).toEqual(queries);
  });

  it('filters out null queries', async () => {
    // Create an invalid query file
    MockFs.writeTextFile(getQueryFilePath('invalid-query'), 'invalid json');

    await initializeQueries();

    expect(QueriesStore.getAll()).toEqual(queries);
  });

  it('dispatches a queries loaded event', async () =>
    new Promise<void>((done) => {
      Events.addListener(QueriesLoadedEvent, 'test', (payload) => {
        expect(payload.data).toEqual(queries);
        done();
      });

      initializeQueries();
    }));
});
