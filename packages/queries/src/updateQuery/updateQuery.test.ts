import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { QueriesStore } from '../QueriesStore';
import { QueryUpdatedEvent, QueryUpdatedEventData } from '../events';
import { MockFs, cleanup, query1, setup } from '../test-utils';
import { Query } from '../types';
import { updateQuery } from './updateQuery';

describe('updateQuery', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates a query', async () => {
    const query = await updateQuery('query-1', {
      name: 'Updated Query Query 1',
    });

    expect(query).toEqual({
      ...query1,
      name: 'Updated Query Query 1',
    });
  });

  it('updates the query in the store', async () => {
    await updateQuery('query-1', {
      name: 'Updated Query Query 1',
    });

    expect(QueriesStore.get('query-1')).toEqual({
      ...query1,
      name: 'Updated Query Query 1',
    });
  });

  it('writes the query config to the file system', async () => {
    await updateQuery('query-1', {
      name: 'Updated Query Query 1',
    });

    expect(MockFs.readJsonFile<Query>(query1.path).name).toBe(
      'Updated Query Query 1',
    );
  });

  it('dispatches the query updated event', async () =>
    new Promise<void>((done) => {
      Events.addListener<QueryUpdatedEventData>(
        QueryUpdatedEvent,
        'test-query-updated',
        (payload) => {
          expect(payload.data.original).toEqual(query1);
          expect(payload.data.updated).toEqual({
            ...query1,
            name: 'Updated Query Query 1',
          });
          done();
        },
      );

      updateQuery('query-1', {
        name: 'Updated Query Query 1',
      });
    }));
});
