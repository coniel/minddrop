import {
  InvalidParameterError,
  InvalidPathError,
  registerFileSystemAdapter,
} from '@minddrop/core';
import { MockFsAdapter } from '@minddrop/test-utils';
import { appendDirToPath } from '@minddrop/utils';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { WorkspaceConfigDir, WorkspaceConfigFile } from '../constants';
import { setup, cleanup, missingWorkspace, workspace1 } from '../test-utils';
import { WorkspacesStore } from '../WorkspacesStore';
import { writeWorkspaceConfig } from './writeWorkspaceConfig';

const WORKSPACE_PATH = workspace1.path;
const WORKSPACE_CONFIG_DIR_PATH = appendDirToPath(
  WorkspaceConfigDir,
  workspace1.path,
);
const WORKSPACE_CONFIG_FILE_PATH = appendDirToPath(
  WorkspaceConfigFile,
  WORKSPACE_CONFIG_DIR_PATH,
);

let workspaceDirExists: boolean;
let workspaceConfigDirExists: boolean;

const exists = async (path: string) => {
  switch (path) {
    case WORKSPACE_PATH:
      return workspaceDirExists;
    case WORKSPACE_CONFIG_DIR_PATH:
      return workspaceConfigDirExists;
    default:
      throw new Error(`unexpected path ${path}`);
  }
};

const createDir = vi.fn();
const writeTextFile = vi.fn();

registerFileSystemAdapter({
  ...MockFsAdapter,
  exists,
  createDir,
  writeTextFile,
});

describe('writeWorkspaceConfig', () => {
  beforeEach(() => {
    setup();

    // Load test workspaces into the store
    WorkspacesStore.getState().add(workspace1);

    // Reset FS return values
    workspaceDirExists = true;
    workspaceConfigDirExists = true;
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
    // Pretend workspace dir does not exist
    workspaceDirExists = false;

    // Attempt to write the config file of a workspace with a missing dir.
    // Should throw a InvalidPathError.
    expect(() => writeWorkspaceConfig(workspace1.path)).rejects.toThrowError(
      InvalidPathError,
    );
  });

  it('creates the workspace config dir if it does not exist', async () => {
    // Pretend workspace config dir does not exist
    workspaceConfigDirExists = false;

    // Write workspace config
    await writeWorkspaceConfig(WORKSPACE_PATH);

    // Should create workspace config dir
    expect(createDir).toHaveBeenCalledWith(WORKSPACE_CONFIG_DIR_PATH);
  });

  it('writes config values to the config file', async () => {
    // Write workspace config
    await writeWorkspaceConfig(WORKSPACE_PATH);

    // Should write config values to config file
    expect(writeTextFile).toHaveBeenCalledWith(
      WORKSPACE_CONFIG_FILE_PATH,
      JSON.stringify({ icon: workspace1.icon }),
    );
  });
});
