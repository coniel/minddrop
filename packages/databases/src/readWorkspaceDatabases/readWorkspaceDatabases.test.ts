import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Paths, isEntityId } from '@minddrop/utils';
import { WorkspaceFixtures } from '@minddrop/workspaces';
import { DatabaseConfigFileName } from '../constants';
import {
  MockFs,
  cleanup,
  databases,
  objectDatabase,
  setup,
} from '../test-utils';
import { Database } from '../types';
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

  it('mints and persists an ID for configs without one', async () => {
    const databasePath = `${workspace_1.path}/No ID Database`;
    const configPath = `${databasePath}/${Paths.hiddenDirName}/${DatabaseConfigFileName}`;

    // Add a database config without an ID
    MockFs.addFiles([
      {
        path: configPath,
        textContent: JSON.stringify({ entrySerializer: 'markdown' }),
      },
    ]);

    const result = await readWorkspaceDatabases(workspace_1.path);
    const database = result.find((current) => current.path === databasePath);

    // The database should have a minted typed ID
    expect(isEntityId(database!.id, 'database')).toBe(true);

    // The minted ID should be persisted back to the config file
    const config = MockFs.readJsonFile<Database>(configPath);
    expect(config.id).toBe(database!.id);
  });

  it('re-mints duplicated config IDs', async () => {
    const databasePath = `${workspace_1.path}/Copied Database`;
    const configPath = `${databasePath}/${Paths.hiddenDirName}/${DatabaseConfigFileName}`;

    // Add a database config duplicating an existing database's ID
    MockFs.addFiles([
      {
        path: configPath,
        textContent: JSON.stringify({
          id: objectDatabase.id,
          entrySerializer: 'markdown',
        }),
      },
    ]);

    const result = await readWorkspaceDatabases(workspace_1.path);
    const ids = result.map((current) => current.id);

    // All IDs should be unique
    expect(new Set(ids).size).toBe(ids.length);
  });
});
