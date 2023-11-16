import { Fs, InvalidPathError } from '@minddrop/file-system';
import {
  DefaultWorkspaceConfig,
  WorkspaceConfigDirName,
  WorkspaceConfigFileName,
} from '../constants';
import { WorkspaceConfig } from '../types';

/**
 * Gets a workspace's configuration or the default workspace
 * configuration if it has none.
 *
 * @param path - The workspace path.
 * @returns The workspace config.
 */
export async function getWorkspaceConfig(
  path: string,
): Promise<WorkspaceConfig> {
  // Ensure workspace dir exists
  if (!(await Fs.exists(path))) {
    throw new InvalidPathError(path);
  }

  // Create workspace's config file path
  const configPath = Fs.concatPath(
    path,
    WorkspaceConfigDirName,
    WorkspaceConfigFileName,
  );

  // If the workspace config file exists, return
  // its contents.
  if (await Fs.exists(configPath)) {
    const config = await Fs.readTextFile(configPath);

    return JSON.parse(config);
  }

  // Return the default config
  return DefaultWorkspaceConfig;
}
