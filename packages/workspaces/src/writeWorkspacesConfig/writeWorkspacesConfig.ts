import { Fs } from '@minddrop/file-system';
import { WorkspacesStore } from '../WorkspacesStore';
import { WorkspacesConfig } from '../types';
import { getWorkspacesConfigFilePath } from '../utils';

/**
 * Writes the workspaces config file to the app config directory.
 */
export async function writeWorkspacesConfig(): Promise<void> {
  // Path to the workspaces config file
  const configFilePath = getWorkspacesConfigFilePath();

  // Generate the workspaces config
  const workspacesConfig: WorkspacesConfig = {
    paths: WorkspacesStore.getAll().map((workspace) => workspace.path),
  };

  // Write the workspaces config to the file system
  await Fs.writeJsonFile(configFilePath, workspacesConfig);
}
