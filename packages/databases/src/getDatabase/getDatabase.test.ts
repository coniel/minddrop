import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseNotFoundError } from '../errors';
import { cleanup, objectDatabase, setup } from '../test-utils';
import { getDatabase } from './getDatabase';

describe('get', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('retrieves a database by name', () => {
    const result = getDatabase(objectDatabase.name);

    expect(result).toBe(objectDatabase);
  });

  it('throws an error if the database does not exist', () => {
    expect(() => getDatabase('missing')).toThrow(DatabaseNotFoundError);
  });

  it('does not throw if the database does not exist and throwOnNotFound is false', () => {
    expect(() => getDatabase('missing', false)).not.toThrow(
      DatabaseNotFoundError,
    );
  });
});
