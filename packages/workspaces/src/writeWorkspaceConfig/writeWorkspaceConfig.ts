import { Fs } from '@minddrop/file-system';
import { omitPath } from '@minddrop/utils';
import { getWorkspace } from '../getWorkspace';
import { getWorkspaceConfigFilePath } from '../utils';

/**
 * Writes a workspace config to the file system.
 * Creates the hidden config directory if it does not exist.
 *
 *
 * @param id - The ID of the workspace to write.
 */
export async function writeWorkspaceConfig(id: string): Promise<void> {
  // Get the workspace
  const workspace = getWorkspace(id);
  // The path to the workspace config file inside the hidden config directory
  const configFilePath = getWorkspaceConfigFilePath(workspace.path);

  // Ensure that the hidden config directory exists
  await Fs.ensureDir(Fs.parentDirPath(configFilePath));

  // Write the workspace config to the file system, omitting the path
  await Fs.writeJsonFile(configFilePath, omitPath(workspace));
}
