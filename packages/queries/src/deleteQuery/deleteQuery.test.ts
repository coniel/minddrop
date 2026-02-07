import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { QueriesStore } from '../QueriesStore';
import { QueryDeletedEvent } from '../events';
import { MockFs, cleanup, query1, setup } from '../test-utils';
import { deleteQuery } from './deleteQuery';

describe('deleteQuery', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('deletes the query from the store', async () => {
    await deleteQuery('query-1');

    expect(QueriesStore.get('query-1')).toBeNull();
  });

  it('deletes the query config from the file system', async () => {
    await deleteQuery('query-1');

    expect(MockFs.exists(query1.path)).toBe(false);
  });

  it('dispatches the query deleted event', async () =>
    new Promise<void>((done) => {
      Events.addListener(QueryDeletedEvent, 'test-query-deleted', (payload) => {
        expect(payload.data).toEqual(query1);
        done();
      });

      deleteQuery('query-1');
    }));
});
