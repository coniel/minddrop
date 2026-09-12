import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { cleanup, objectDatabase, parentDir, setup } from '../../test-utils';
import { resolveDatabasePath } from './resolveDatabasePath';

const { workspace_2 } = WorkspaceFixtures;

describe('resolveDatabasePath', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("resolves the database's path against the workspace", () => {
    expect(resolveDatabasePath(objectDatabase)).toBe(
      `${parentDir}/${objectDatabase.path}`,
    );
  });

  it('resolves a workspace relative path', () => {
    expect(resolveDatabasePath(objectDatabase.path)).toBe(
      `${parentDir}/${objectDatabase.path}`,
    );
  });

  it('resolves against the given workspace', () => {
    expect(resolveDatabasePath(objectDatabase, workspace_2.path)).toBe(
      `${workspace_2.path}/${objectDatabase.path}`,
    );
  });
});
