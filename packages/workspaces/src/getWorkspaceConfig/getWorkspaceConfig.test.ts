import { InvalidPathError, registerFileSystemAdapter } from '@minddrop/core';
import { MockFsAdapter } from '@minddrop/test-utils';
import { concatPath } from '@minddrop/utils';
import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  DefaultWorkspaceConfig,
  WorkspaceConfigDir,
  WorkspaceConfigFile,
} from '../constants';
import { setup, cleanup, workspace1, workspace1Config } from '../test-utils';
import { getWorkspaceConfig } from './getWorkspaceConfig';

const WORKSPACE_PATH = workspace1.path;
const WORKSPACE_CONFIG_PATH = concatPath(
  workspace1.path,
  WorkspaceConfigDir,
  WorkspaceConfigFile,
);

let workspaceDirExists: boolean;
let workspaceConfigFileExists: boolean;

const exists = async (path: string) => {
  switch (path) {
    case WORKSPACE_PATH:
      return workspaceDirExists;
    case WORKSPACE_CONFIG_PATH:
      return workspaceConfigFileExists;
    default:
      throw new Error(`unexpected path ${path}`);
  }
};

const readTextFile = async (path: string) =>
  path === WORKSPACE_CONFIG_PATH ? JSON.stringify(workspace1Config) : '{}';

registerFileSystemAdapter({ ...MockFsAdapter, exists, readTextFile });

describe('getWorkspaceConfig', () => {
  beforeEach(() => {
    setup();

    // Reset FS mock return values
    workspaceDirExists = true;
    workspaceConfigFileExists = true;
  });

  afterEach(cleanup);

  it('throws if the workspace path does not exist', () => {
    // Pretend workspace dir does not exist
    workspaceDirExists = false;

    // Attempt to get the workspace config, should
    // throw a InvalidPathError.
    expect(() => getWorkspaceConfig(WORKSPACE_PATH)).rejects.toThrow(
      InvalidPathError,
    );
  });

  it('returns the workspace config if it exists', async () => {
    // Get the workspace config
    const config = await getWorkspaceConfig(WORKSPACE_PATH);

    // Should return the config
    expect(config).toEqual(workspace1Config);
  });

  it('returns the default config if workspace does not have one', async () => {
    // Pretend that workspace config file does not exist
    workspaceConfigFileExists = false;

    // Get the workspace config
    const config = await getWorkspaceConfig(WORKSPACE_PATH);

    // Should return default config
    expect(config).toEqual(DefaultWorkspaceConfig);
  });
});
