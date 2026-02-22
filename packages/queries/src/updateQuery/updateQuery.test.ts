import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { QueriesStore } from '../QueriesStore';
import { QueryUpdatedEvent, QueryUpdatedEventData } from '../events';
import { MockFs, cleanup, mockDate, query_1, setup } from '../test-utils';
import { Query } from '../types';
import { getQueryFilePath } from '../utils';
import { updateQuery } from './updateQuery';

const update = {
  name: 'Updated Query Query 1',
};
const updatedQuery: Query = {
  ...query_1,
  ...update,
  lastModified: mockDate,
};

describe('updateQuery', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('updates the query in the store', async () => {
    await updateQuery(query_1.id, update);

    expect(QueriesStore.get(query_1.id)).toEqual(updatedQuery);
  });

  it('writes the query config to the file system', async () => {
    await updateQuery(query_1.id, update);

    expect(MockFs.readJsonFile(getQueryFilePath(query_1.id))).toEqual(
      updatedQuery,
    );
  });

  it('returns the updated query', async () => {
    const query = await updateQuery(query_1.id, update);

    expect(query).toEqual(updatedQuery);
  });

  it('dispatches the query updated event', async () =>
    new Promise<void>((done) => {
      Events.addListener<QueryUpdatedEventData>(
        QueryUpdatedEvent,
        'test-query-updated',
        (payload) => {
          expect(payload.data.original).toEqual(query_1);
          expect(payload.data.updated).toEqual(updatedQuery);
          done();
        },
      );

      updateQuery(query_1.id, update);
    }));
});
