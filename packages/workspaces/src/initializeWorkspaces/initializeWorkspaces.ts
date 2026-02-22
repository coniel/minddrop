import { Events } from '@minddrop/events';
import { BaseDirectory, Fs } from '@minddrop/file-system';
import { WorkspacesStore } from '../WorkspacesStore';
import { WorkspacesConfigFileName } from '../constants';
import { WorkspacesLoadedEvent, WorkspacesLoadedEventData } from '../events';
import { readWorkspaceConfig } from '../readWorkspaceConfig';
import { WorkspacesConfig } from '../types';
import { getWorkspacesConfigFilePath } from '../utils';

/**
 * Initializes workspaces by reading the workspaces config file
 * and loading workspaces from the file system.
 *
 * @dispatches workspaces:loaded
 */
export async function initializeWorkspaces(): Promise<void> {
  const configFilePath = getWorkspacesConfigFilePath();

  // Ensure the workspaces config file exists
  if (!(await Fs.exists(configFilePath))) {
    await Fs.writeJsonFile(configFilePath, { paths: [] });
  }

  // Read the workspaces config file
  const config = await Fs.readJsonFile<WorkspacesConfig>(
    WorkspacesConfigFileName,
    {
      baseDir: BaseDirectory.AppConfig,
    },
  );

  // Read workspaces from the file system
  const workspacePromises = await Promise.all(
    config.paths.map((path) => readWorkspaceConfig(path, false)),
  );

  // Filter out null workspaces
  const workspaces = workspacePromises.filter(
    (workspace) => workspace !== null,
  );

  // Load workspaces into the store
  WorkspacesStore.load(workspaces);

  // Dispatch a workspaces loaded event
  Events.dispatch<WorkspacesLoadedEventData>(WorkspacesLoadedEvent, workspaces);
}
