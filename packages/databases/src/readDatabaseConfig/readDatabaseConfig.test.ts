import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import {
  MockFs,
  cleanup,
  databaseDirPath,
  objectDatabase,
  setup,
} from '../test-utils';
import { resolveDatabaseConfigFilePath } from '../utils';
import { readDatabaseConfig } from './readDatabaseConfig';

const { workspace_1 } = WorkspaceFixtures;

const configPath = resolveDatabaseConfigFilePath(
  databaseDirPath(objectDatabase),
);

describe('readDatabaseConfig', () => {
  beforeEach(() => setup({ loadDatabases: false }));

  afterEach(cleanup);

  it('reads a database config', async () => {
    expect(await readDatabaseConfig(workspace_1.path, configPath)).toEqual({
      status: 'read',
      value: objectDatabase,
    });
  });

  it('names the database after its directory, at its path relative to the workspace', async () => {
    // Write a config naming the database something else
    MockFs.writeTextFile(
      configPath,
      JSON.stringify({ ...objectDatabase, name: 'Other', path: 'Other' }),
    );

    expect(await readDatabaseConfig(workspace_1.path, configPath)).toEqual({
      status: 'read',
      value: objectDatabase,
    });
  });

  it('reports a config which cannot be parsed as unreadable', async () => {
    MockFs.writeTextFile(configPath, '{ not json');

    expect(await readDatabaseConfig(workspace_1.path, configPath)).toEqual({
      status: 'unreadable',
    });
  });

  it('reports a missing config as missing', async () => {
    MockFs.removeFile(configPath);

    expect(await readDatabaseConfig(workspace_1.path, configPath)).toEqual({
      status: 'missing',
    });
  });
});
