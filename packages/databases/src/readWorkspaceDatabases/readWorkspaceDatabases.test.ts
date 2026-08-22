import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Paths, isEntityId } from '@minddrop/utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
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
    addCopiedDatabase();

    const result = await readWorkspaceDatabases(workspace_1.path);
    const ids = result.map((current) => current.id);

    // All IDs should be unique
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('keeps the ID for the config at the recorded path', async () => {
    const copyPath = addCopiedDatabase();

    // Read with the database recorded at the copy's path, which the
    // scan reaches after the config it was copied from
    const result = await readWorkspaceDatabases(
      workspace_1.path,
      new Map([[objectDatabase.id, copyPath]]),
    );

    // The config at the recorded path should keep the ID, the scan
    // order notwithstanding
    expect(databaseAtPath(result, copyPath).id).toBe(objectDatabase.id);
    expect(databaseAtPath(result, objectDatabase.path).id).not.toBe(
      objectDatabase.id,
    );
  });

  it('persists the ID minted for the config which did not keep it', async () => {
    const copyPath = addCopiedDatabase();

    const result = await readWorkspaceDatabases(
      workspace_1.path,
      new Map([[objectDatabase.id, copyPath]]),
    );

    // The re-minted ID should be persisted back to its config file
    const config = MockFs.readJsonFile<Database>(
      configPathFor(objectDatabase.path),
    );

    expect(config.id).toBe(databaseAtPath(result, objectDatabase.path).id);
  });

  it('falls back to scan order when no config sits at the recorded path', async () => {
    addCopiedDatabase();

    // Read with the database recorded somewhere neither config is,
    // as when both were copied in
    const result = await readWorkspaceDatabases(
      workspace_1.path,
      new Map([[objectDatabase.id, `${workspace_1.path}/Moved Away`]]),
    );

    // The first config found should keep the ID
    expect(databaseAtPath(result, objectDatabase.path).id).toBe(
      objectDatabase.id,
    );
  });
});

/**
 * Adds a config duplicating an existing database's ID, as copying
 * that database's directory would.
 *
 * @returns The path of the copied database directory.
 */
function addCopiedDatabase(): string {
  const databasePath = `${workspace_1.path}/Copied Database`;

  MockFs.addFiles([
    {
      path: configPathFor(databasePath),
      textContent: JSON.stringify({
        id: objectDatabase.id,
        entrySerializer: 'markdown',
      }),
    },
  ]);

  return databasePath;
}

/**
 * Returns the path of a database directory's config file.
 */
function configPathFor(databasePath: string): string {
  return `${databasePath}/${Paths.hiddenDirName}/${DatabaseConfigFileName}`;
}

/**
 * Returns the read database sitting at the given path.
 */
function databaseAtPath(databases: Database[], path: string): Database {
  return databases.find((database) => database.path === path)!;
}
