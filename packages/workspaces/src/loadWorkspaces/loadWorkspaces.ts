import { Events } from '@minddrop/events';
import { getWorkspaceFromPath } from '../getWorkspaceFromPath';
import { getWorkspacesConfig } from '../getWorkspacesConfig';
import { Workspace } from '../types';
import { WorkspacesStore } from '../WorkspacesStore';

/**
 * Loads the user's workspaces into the workspaces store.
 *
 * Dispatches a 'workspaces:load' event.
 *
 * @returns The loaded workspaces.
 *
 * @throws {FileNotFoundError} - Workspaces config file not found.
 * @throws {JsonParseError} - Failed to parse workspaces config file.
 */
export async function loadWorkspaces(): Promise<Workspace[]> {
  // Get the existing workspaces from the store
  const existingWorkspaces = WorkspacesStore.getState().workspaces;

  // Get the user's workspaces config
  const workspacesConfig = await getWorkspacesConfig();

  // Filter out the existing workspace paths from the
  // config's workspace paths.
  const newPaths = workspacesConfig.paths.filter(
    (path) => !existingWorkspaces.find((workspace) => workspace.path === path),
  );

  // If there are no new paths, there is nothing to load
  if (newPaths.length === 0) {
    return [];
  }

  // Get workspaces listed in the config
  const newWorkspaces: Workspace[] = await Promise.all(
    newPaths.map(getWorkspaceFromPath),
  );

  // Load workspace paths into store
  WorkspacesStore.getState().load(newWorkspaces);

  // Dispatch a 'workspaces:load' event
  Events.dispatch('workspaces:load', newWorkspaces);

  return newWorkspaces;
}
