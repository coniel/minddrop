import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabaseNotFoundError } from '../errors';
import { cleanup, objectDatabase, setup } from '../test-utils';
import { getDatabase } from './getDatabase';

const { workspace_2 } = WorkspaceFixtures;

describe('get', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('retrieves a database by name', () => {
    const result = getDatabase(objectDatabase.id);

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

  it('retrieves the database from the given workspace', () => {
    expect(getDatabase(objectDatabase.id, false, workspace_2.id)).toBeNull();
  });
});
