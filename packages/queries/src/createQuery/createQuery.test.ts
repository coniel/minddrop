import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { QueriesStore } from '../QueriesStore';
import { QueryCreatedEvent } from '../events';
import { MockFs, cleanup, mockDate, setup } from '../test-utils';
import { getQueryFilePath } from '../utils';
import { createQuery } from './createQuery';

const newQuery = {
  id: expect.any(String),
  created: mockDate,
  lastModified: mockDate,
  filters: [],
  sort: [],
  name: 'Query',
};

describe('createQuery', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates a query', async () => {
    const query = await createQuery();

    expect(query).toEqual(newQuery);
  });

  it('adds the query to the store', async () => {
    const query = await createQuery();

    expect(QueriesStore.get(query.id)).toEqual(newQuery);
  });

  it('writes the query config to the file system', async () => {
    const query = await createQuery();

    expect(MockFs.readJsonFile(getQueryFilePath(query.id))).toEqual(newQuery);
  });

  it('dispatches the query created event', async () =>
    new Promise<void>((done) => {
      Events.addListener(QueryCreatedEvent, 'test-query-created', (payload) => {
        expect(payload.data).toEqual(newQuery);
        done();
      });

      createQuery();
    }));
});
