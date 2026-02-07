import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { Paths, restoreDates } from '@minddrop/utils';
import { QueriesStore } from '../QueriesStore';
import { QueriesDirectory } from '../constants';
import { QueryCreatedEvent } from '../events';
import { MockFs, cleanup, setup } from '../test-utils';
import { createQuery } from './createQuery';

describe('createQuery', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds the query to the store', async () => {
    const query = await createQuery();

    expect(QueriesStore.get(query.id)).toEqual(query);
  });

  it('writes the query config to the file system', async () => {
    const query = await createQuery();
    const qurtyFilePath = `${Paths.workspace}/${QueriesDirectory}/${query.name}.query`;

    const { path, ...queryWithoutPath } = query;

    expect(restoreDates(MockFs.readJsonFile(qurtyFilePath))).toEqual(
      queryWithoutPath,
    );
  });

  it('increments the query name if necessary', async () => {
    // Create a query with a name that already exists
    const query = await createQuery();
    // Create a query with a name that does not already exist
    const query2 = await createQuery();

    expect(query.name).toBe('Query');
    expect(query2.name).toBe('Query 2');
  });

  it('dispatches the query created event', async () =>
    new Promise<void>((done) => {
      // Remove all existing queries
      QueriesStore.clear();

      Events.addListener(QueryCreatedEvent, 'test-query-created', (payload) => {
        // Get the created query
        const query = QueriesStore.getAll()[0];

        expect(payload.data).toEqual(query);
        done();
      });

      createQuery();
    }));
});
