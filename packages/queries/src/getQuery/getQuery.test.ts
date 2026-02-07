import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { QueryNotFoundError } from '../errors';
import { cleanup, query1, setup } from '../test-utils';
import { getQuery } from './getQuery';

describe('get', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('retrieves a query by name', () => {
    const result = getQuery(query1.id);

    expect(result).toBe(query1);
  });

  it('throws an error if the query does not exist', () => {
    expect(() => getQuery('missing')).toThrow(QueryNotFoundError);
  });

  it('does not throw if the query does not exist and throwOnNotFound is false', () => {
    expect(() => getQuery('missing', false)).not.toThrow(QueryNotFoundError);
  });
});
