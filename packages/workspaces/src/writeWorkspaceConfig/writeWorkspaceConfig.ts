import { Fs, InvalidParameterError, InvalidPathError } from '@minddrop/core';
import { appendDirToPath } from '@minddrop/utils';
import { WorkspaceConfigDir, WorkspaceConfigFile } from '../constants';
import { getWorkspace } from '../getWorkspace';
import { WorkspaceConfig } from '../types';

/**
 * Writes the relevant values from the current workspace state
 * to its config file.
 *
 * @param path - The workspace path.
 *
 * @throws {InvalidParameterError} - Workspace does not exist.
 * @throws {InvalidPathError} - Workspace dir does not exist.
 */
export async function writeWorkspaceConfig(path: string): Promise<void> {
  // Get the workspace from the store
  const workspace = getWorkspace(path);

  // Ensure workspace exists
  if (!workspace) {
    throw new InvalidParameterError(`Workspace does not exist: ${path}`);
  }

  // Ensure workspace dir exists
  if (!(await Fs.exists(path))) {
    throw new InvalidPathError(path);
  }

  // Get relevant values from store workspace
  const config: WorkspaceConfig = { icon: workspace.icon };

  // Generate workspace config hidden dir path
  const configDirPath = appendDirToPath(WorkspaceConfigDir, path);

  // Create hidden workspace config dir if it doesn't exist
  if (!(await Fs.exists(configDirPath))) {
    await Fs.createDir(configDirPath);
  }

  // Generate workspace config file path
  const configFilePath = appendDirToPath(WorkspaceConfigFile, configDirPath);

  // Write values to workspace config file
  Fs.writeTextFile(configFilePath, JSON.stringify(config));
}
