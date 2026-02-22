import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Events } from '@minddrop/events';
import { Paths } from '@minddrop/utils';
import { QueriesStore } from '../QueriesStore';
import { QueriesDirectory } from '../constants';
import { QueryCreatedEvent } from '../events';
import {
  MockFs,
  cleanup,
  mockDate,
  queriesBasePath,
  setup,
} from '../test-utils';
import { createQuery } from './createQuery';

const createdQuery = {
  id: expect.any(String),
  created: mockDate,
  lastModified: mockDate,
  filters: [],
  sort: [],
  name: 'Query',
  path: `${queriesBasePath}/Query.query`,
};

describe('createQuery', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates a query', async () => {
    const query = await createQuery();

    expect(query).toEqual(createdQuery);
  });

  it('adds the query to the store', async () => {
    const query = await createQuery();

    expect(QueriesStore.get(query.id)).toEqual(createdQuery);
  });

  it('writes the query config to the file system', async () => {
    const query = await createQuery();
    const qurtyFilePath = `${Paths.workspace}/${QueriesDirectory}/${query.name}.query`;

    const { path, ...queryWithoutPath } = createdQuery;

    expect(MockFs.readJsonFile(qurtyFilePath)).toEqual(queryWithoutPath);
  });

  it('increments the query name if necessary', async () => {
    // Create a query with a name that already exists
    const query = await createQuery();
    // Create a query with a name that does not already exist
    const query2 = await createQuery();

    expect(query.name).toBe('Query');
    expect(query2.name).toBe('Query 1');
  });

  it('dispatches the query created event', async () =>
    new Promise<void>((done) => {
      Events.addListener(QueryCreatedEvent, 'test-query-created', (payload) => {
        expect(payload.data).toEqual(createdQuery);
        done();
      });

      createQuery();
    }));
});
