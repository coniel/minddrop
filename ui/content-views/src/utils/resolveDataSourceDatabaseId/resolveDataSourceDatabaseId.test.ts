import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CollectionFixtures } from '@minddrop/collections/test-utils';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Queries } from '@minddrop/queries';
import { QueryFixtures } from '@minddrop/queries/test-utils';
import { cleanup, setup } from '../../test-utils';
import { resolveDataSourceDatabaseId } from './resolveDataSourceDatabaseId';

const { collection_1 } = CollectionFixtures;
const { objectDatabase } = DatabaseFixtures;
const { query_1, query_twoDatabases_1 } = QueryFixtures;

describe('resolveDataSourceDatabaseId', () => {
  beforeEach(() => {
    setup();

    Queries.Store.load([query_1, query_twoDatabases_1]);
  });

  afterEach(async () => {
    Queries.Store.clear();
    await cleanup();
  });

  it('resolves a database source to its database', () => {
    expect(
      resolveDataSourceDatabaseId({ type: 'database', id: objectDatabase.id }),
    ).toBe(objectDatabase.id);
  });

  it('resolves a query fed by one database to it', () => {
    expect(resolveDataSourceDatabaseId({ type: 'query', id: query_1.id })).toBe(
      objectDatabase.id,
    );
  });

  it('resolves no database for a query fed by several', () => {
    expect(
      resolveDataSourceDatabaseId({
        type: 'query',
        id: query_twoDatabases_1.id,
      }),
    ).toBeNull();
  });

  it('resolves no database for a query which does not exist', () => {
    expect(
      resolveDataSourceDatabaseId({ type: 'query', id: 'missing' }),
    ).toBeNull();
  });

  it('resolves no database for a collection', () => {
    expect(
      resolveDataSourceDatabaseId({ type: 'collection', id: collection_1.id }),
    ).toBeNull();
  });
});
