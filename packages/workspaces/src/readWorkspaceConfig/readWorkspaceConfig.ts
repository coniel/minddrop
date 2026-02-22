import { Fs } from '@minddrop/file-system';
import { WorkspaceNotFoundError } from '../errors';
import { Workspace } from '../types';
import { getWorkspaceConfigFilePath } from '../utils';

/**
 * Reads a workspace config from the file system.
 *
 * @param path - The path to the workspace directory.
 * @returns The workspace config.
 *
 * @throws {WorkspaceNotFoundError} If the workspace does not exist.
 */
export async function readWorkspaceConfig(path: string): Promise<Workspace>;
export async function readWorkspaceConfig(
  path: string,
  throwOnNotFound: false,
): Promise<Workspace | null>;
export async function readWorkspaceConfig(
  path: string,
  throwOnNotFound = true,
): Promise<Workspace | null> {
  // Path to the workspace config file
  const configPath = getWorkspaceConfigFilePath(path);

  // Ensure the workspace config file exists
  if (!(await Fs.exists(configPath))) {
    if (throwOnNotFound) {
      throw new WorkspaceNotFoundError(path);
    } else {
    }

    return null;
  }

  // Read and parse the workspace config
  const workspace = await Fs.readJsonFile<Workspace>(configPath);

  // Restore the path
  return {
    ...workspace,
    path,
  };
}
