import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { QueriesStore } from '../QueriesStore';
import { QueryDeletedEvent } from '../events';
import { MockFs, cleanup, query_1, setup } from '../test-utils';
import { getQueryFilePath } from '../utils';
import { deleteQuery } from './deleteQuery';

describe('deleteQuery', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('deletes the query from the store', async () => {
    await deleteQuery(query_1.id);

    expect(QueriesStore.get(query_1.id)).toBeNull();
  });

  it('deletes the query config from the file system', async () => {
    await deleteQuery(query_1.id);

    expect(MockFs.exists(getQueryFilePath(query_1.id))).toBe(false);
  });

  it('dispatches the query deleted event', async () =>
    new Promise<void>((done) => {
      Events.addListener(QueryDeletedEvent, 'test-query-deleted', (payload) => {
        expect(payload.data).toEqual(query_1);
        done();
      });

      deleteQuery(query_1.id);
    }));
});
