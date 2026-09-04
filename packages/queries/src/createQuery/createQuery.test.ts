import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { QueriesStore } from '../QueriesStore';
import { QueryCreatedEvent } from '../events';
import { MockFs, cleanup, mockDate, setup } from '../test-utils';
import { resolveQueryFilePath } from '../utils';
import { createQuery } from './createQuery';

const newQuery = {
  id: expect.any(String),
  created: mockDate,
  lastModified: mockDate,
  nodes: [
    {
      id: expect.any(String),
      type: 'source',
      sources: [],
      x: expect.any(Number),
      y: expect.any(Number),
    },
    {
      id: expect.any(String),
      type: 'results',
      x: expect.any(Number),
      y: expect.any(Number),
    },
  ],
  connections: [],
  name: 'Query',
};

describe('createQuery', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates a query with a source and results node', async () => {
    const query = await createQuery();

    expect(query).toEqual(newQuery);
  });

  it('adds the query to the store', async () => {
    const query = await createQuery();

    expect(QueriesStore.get(query.id)).toEqual(newQuery);
  });

  it('writes the query config to the file system', async () => {
    const query = await createQuery();

    expect(MockFs.readJsonFile(resolveQueryFilePath(query.id))).toEqual(
      newQuery,
    );
  });

  it('dispatches the query created event', async () =>
    new Promise<void>((done) => {
      Events.addListener(QueryCreatedEvent, 'test-query-created', (payload) => {
        expect(payload).toEqual(newQuery);
        done();
      });

      createQuery();
    }));
});
