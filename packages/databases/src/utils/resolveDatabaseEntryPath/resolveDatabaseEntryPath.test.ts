import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabaseNotFoundError } from '../../errors';
import {
  cleanup,
  databaseEntryFilePath,
  objectDatabase,
  objectEntry1,
  setup,
} from '../../test-utils';
import { resolveDatabaseEntryPath } from './resolveDatabaseEntryPath';

const { workspace_2 } = WorkspaceFixtures;

describe('resolveDatabaseEntryPath', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("resolves the entry's path against its database", () => {
    expect(resolveDatabaseEntryPath(objectEntry1)).toBe(
      databaseEntryFilePath(objectEntry1),
    );
  });

  it('uses the given database', () => {
    expect(resolveDatabaseEntryPath(objectEntry1, objectDatabase)).toBe(
      databaseEntryFilePath(objectEntry1),
    );
  });

  it('resolves a database relative path', () => {
    expect(resolveDatabaseEntryPath(objectEntry1.path, objectDatabase)).toBe(
      databaseEntryFilePath(objectEntry1),
    );
  });

  it('resolves against the given workspace', () => {
    expect(
      resolveDatabaseEntryPath(objectEntry1, objectDatabase, workspace_2.path),
    ).toBe(`${workspace_2.path}/${objectDatabase.path}/${objectEntry1.path}`);
  });

  it("throws if the entry's database does not exist", () => {
    expect(() =>
      resolveDatabaseEntryPath({
        ...objectEntry1,
        database: 'database_missing',
      }),
    ).toThrow(DatabaseNotFoundError);
  });
});
