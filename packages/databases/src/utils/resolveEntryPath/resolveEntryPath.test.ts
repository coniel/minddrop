import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { DatabaseNotFoundError } from '../../errors';
import {
  cleanup,
  entryFilePath,
  objectDatabase,
  objectEntry1,
  setup,
} from '../../test-utils';
import { resolveEntryPath } from './resolveEntryPath';

const { workspace_2 } = WorkspaceFixtures;

describe('resolveEntryPath', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("resolves the entry's path against its database", () => {
    expect(resolveEntryPath(objectEntry1)).toBe(entryFilePath(objectEntry1));
  });

  it('uses the given database', () => {
    expect(resolveEntryPath(objectEntry1, objectDatabase)).toBe(
      entryFilePath(objectEntry1),
    );
  });

  it('resolves a database relative path', () => {
    expect(resolveEntryPath(objectEntry1.path, objectDatabase)).toBe(
      entryFilePath(objectEntry1),
    );
  });

  it('resolves against the given workspace', () => {
    expect(
      resolveEntryPath(objectEntry1, objectDatabase, workspace_2.path),
    ).toBe(`${workspace_2.path}/${objectDatabase.path}/${objectEntry1.path}`);
  });

  it("throws if the entry's database does not exist", () => {
    expect(() =>
      resolveEntryPath({
        ...objectEntry1,
        database: 'database_missing',
      }),
    ).toThrow(DatabaseNotFoundError);
  });
});
