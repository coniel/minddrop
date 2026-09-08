import { Fs } from '@minddrop/file-system';
import { WorkspacesStore } from '../WorkspacesStore';
import { getActiveWorkspace } from '../getActiveWorkspace';
import { WorkspacesConfig } from '../types';
import { resolveWorkspacesConfigFilePath } from '../utils';

/**
 * Writes the workspaces config file to the app config directory.
 */
export async function writeWorkspacesConfig(): Promise<void> {
  // Path to the workspaces config file
  const configFilePath = resolveWorkspacesConfigFilePath();

  // The active workspace, absent until workspaces are initialized
  const activeWorkspace = getActiveWorkspace(false);

  // Generate the workspaces config
  const workspacesConfig: WorkspacesConfig = {
    paths: WorkspacesStore.getAllArray().map((workspace) => workspace.path),
    activePath: activeWorkspace?.path,
  };

  // Write the workspaces config to the file system
  await Fs.writeJsonFile(configFilePath, workspacesConfig);
}
