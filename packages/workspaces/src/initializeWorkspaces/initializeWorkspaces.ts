import { Events } from '@minddrop/events';
import { BaseDirectory, Fs } from '@minddrop/file-system';
import { setActiveWorkspaceScope } from '@minddrop/stores';
import { entityId, isEntityId } from '@minddrop/utils';
import { ActiveWorkspaceStore } from '../ActiveWorkspaceStore';
import { WorkspacesStore } from '../WorkspacesStore';
import { WorkspacesConfigFileName } from '../constants';
import { WorkspacesLoadedEvent } from '../events';
import { readWorkspaceConfig } from '../readWorkspaceConfig';
import { WorkspaceId, WorkspacesConfig } from '../types';
import { resolveWorkspacesConfigFilePath } from '../utils';
import { writeWorkspaceConfig } from '../writeWorkspaceConfig';

/**
 * Initializes workspaces by reading the workspaces config file
 * and loading workspaces from the file system. Sets the active
 * workspace from them.
 *
 * @dispatches workspaces:loaded
 */
export async function initializeWorkspaces(): Promise<void> {
  const configFilePath = resolveWorkspacesConfigFilePath();

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
  const rawWorkspaces = workspacePromises.filter(
    (workspace) => workspace !== null,
  );

  // Track workspaces whose IDs get normalized
  const normalizedIds: WorkspaceId[] = [];

  // Re-mint IDs that are not typed workspace IDs
  const workspaces = rawWorkspaces.map((workspace) => {
    if (isEntityId(workspace.id, 'workspace')) {
      return workspace;
    }

    const normalized = { ...workspace, id: entityId('workspace') };
    normalizedIds.push(normalized.id);

    return normalized;
  });

  // Load workspaces into the store
  WorkspacesStore.load(workspaces);

  // Persist normalized IDs back to the workspace configs
  await Promise.all(normalizedIds.map((id) => writeWorkspaceConfig(id)));

  // Resolve the workspace the app last opened into, hydrated into the
  // store beforehand, falling back to the first loaded one when it is
  // no longer listed.
  const lastActiveId = ActiveWorkspaceStore.get('id');
  const activeWorkspace =
    workspaces.find((workspace) => workspace.id === lastActiveId) ||
    workspaces[0];

  if (activeWorkspace) {
    // Set the active workspace, which persists a fallback so that it
    // does not have to be resolved again on the next launch.
    ActiveWorkspaceStore.set('id', activeWorkspace.id);

    // Point workspace scoped stores at the active workspace
    setActiveWorkspaceScope(activeWorkspace.id);
  }

  // Dispatch a workspaces loaded event
  Events.dispatch(WorkspacesLoadedEvent, workspaces);
}
