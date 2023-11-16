import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import {
  Fs,
  initializeMockFileSystem,
  InvalidPathError,
} from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import { WorkspaceConfigDirName, WorkspaceConfigFileName } from '../constants';
import { setup, cleanup, missingWorkspace, workspace1 } from '../test-utils';
import { WorkspacesStore } from '../WorkspacesStore';
import { writeWorkspaceConfig } from './writeWorkspaceConfig';

const WORKSPACE_PATH = workspace1.path;
const WORKSPACE_CONFIG_DIR_PATH = Fs.concatPath(
  workspace1.path,
  WorkspaceConfigDirName,
);
const WORKSPACE_CONFIG_FILE_PATH = Fs.concatPath(
  WORKSPACE_CONFIG_DIR_PATH,
  WorkspaceConfigFileName,
);

const MockFs = initializeMockFileSystem([
  // Workspace config dir
  WORKSPACE_CONFIG_DIR_PATH,
]);

describe('writeWorkspaceConfig', () => {
  beforeEach(() => {
    setup();

    // Load test workspaces into the store
    WorkspacesStore.getState().add(workspace1);

    // Reset mock file system
    MockFs.reset();
  });

  afterEach(cleanup);

  it('throws if the workspace does not exist', () => {
    // Attempt to write the config file of a missing workspace.
    // Should throw a InvalidParameterError.
    expect(() =>
      writeWorkspaceConfig(missingWorkspace.path),
    ).rejects.toThrowError(InvalidParameterError);
  });

  it('throws if the workspace dir does not exist', () => {
    // Remove workspace directory
    MockFs.removeFile(WORKSPACE_PATH);

    // Attempt to write the config file of a workspace with a missing dir.
    // Should throw a InvalidPathError.
    expect(() => writeWorkspaceConfig(workspace1.path)).rejects.toThrowError(
      InvalidPathError,
    );
  });

  it('creates the workspace config dir if it does not exist', async () => {
    // Pretend workspace config dir does not exist
    MockFs.removeDir(WORKSPACE_CONFIG_DIR_PATH);

    // Write workspace config
    await writeWorkspaceConfig(WORKSPACE_PATH);

    // Should create workspace config dir
    expect(MockFs.exists(WORKSPACE_CONFIG_DIR_PATH)).toBe(true);
  });

  it('writes config values to the config file', async () => {
    // Write workspace config
    await writeWorkspaceConfig(WORKSPACE_PATH);

    // Should write config values to config file
    expect(MockFs.readTextFile(WORKSPACE_CONFIG_FILE_PATH)).toBe(
      JSON.stringify({ icon: workspace1.icon }),
    );
  });
});
