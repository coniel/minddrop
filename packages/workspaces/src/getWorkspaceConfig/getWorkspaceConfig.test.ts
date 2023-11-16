import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  InvalidPathError,
  initializeMockFileSystem,
  Fs,
} from '@minddrop/file-system';
import {
  DefaultWorkspaceConfig,
  WorkspaceConfigDirName,
  WorkspaceConfigFileName,
} from '../constants';
import { setup, cleanup, workspace1, workspace1Config } from '../test-utils';
import { getWorkspaceConfig } from './getWorkspaceConfig';

const WORKSPACE_PATH = workspace1.path;
const WORKSPACE_CONFIG_PATH = Fs.concatPath(
  workspace1.path,
  WorkspaceConfigDirName,
  WorkspaceConfigFileName,
);

const MockFs = initializeMockFileSystem([
  // Workspace 1 config file
  {
    path: WORKSPACE_CONFIG_PATH,
    textContent: JSON.stringify(workspace1Config),
  },
]);

describe('getWorkspaceConfig', () => {
  beforeEach(() => {
    setup();

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('throws if the workspace path does not exist', () => {
    // Pretend workspace dir does not exist
    MockFs.clear();

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
    MockFs.removeDir(Fs.parentDirPath(WORKSPACE_CONFIG_PATH));

    // Get the workspace config
    const config = await getWorkspaceConfig(WORKSPACE_PATH);

    // Should return default config
    expect(config).toEqual(DefaultWorkspaceConfig);
  });
});
