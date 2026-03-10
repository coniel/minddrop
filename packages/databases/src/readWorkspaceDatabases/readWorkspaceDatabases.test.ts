import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Paths } from '@minddrop/utils';
import { WorkspaceFixtures } from '@minddrop/workspaces';
import { DatabaseConfigFileName } from '../constants';
import { cleanup, databases, setup } from '../test-utils';
import { readWorkspaceDatabases } from './readWorkspaceDatabases';

const { workspace_1 } = WorkspaceFixtures;

describe('readWorkspaceDatabases', () => {
  beforeEach(() => setup({ loadDatabases: false }));

  afterEach(cleanup);

  it('reads all database configs from a workspace directory', async () => {
    // Read databases from the workspace
    const result = await readWorkspaceDatabases(workspace_1.path);

    // Should find all databases that live under the workspace path
    expect(result).toEqual(expect.arrayContaining(databases));
    expect(result).toHaveLength(databases.length);
  });

  it('sets the database path to the root database directory', async () => {
    // Read databases from the workspace
    const result = await readWorkspaceDatabases(workspace_1.path);

    // Each database path should not contain .minddrop or database.json
    for (const database of result) {
      expect(database.path).not.toContain(Paths.hiddenDirName);
      expect(database.path).not.toContain(DatabaseConfigFileName);
    }
  });

  it('returns an empty array for a workspace with no databases', async () => {
    // Use workspace_2 path which has no databases in the mock FS
    const result = await readWorkspaceDatabases(
      WorkspaceFixtures.workspace_2.path,
    );

    expect(result).toEqual([]);
  });
});
