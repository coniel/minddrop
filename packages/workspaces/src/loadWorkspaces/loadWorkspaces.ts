import { Events } from '@minddrop/events';
import { WorkspacesStore } from '../WorkspacesStore';
import { getWorkspaceFromPath } from '../getWorkspaceFromPath';
import { getWorkspacesConfig } from '../getWorkspacesConfig';
import { Workspace } from '../types';

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
  // Get the user's workspaces config
  const workspacesConfig = await getWorkspacesConfig();

  // If there are no paths, there is nothing to load
  if (workspacesConfig.paths.length === 0) {
    return [];
  }

  // Get workspaces listed in the config
  const configWorkspaces: Workspace[] = await Promise.all(
    workspacesConfig.paths.map(getWorkspaceFromPath),
  );

  // Get the existing workspaces from the store
  const existingWorkspaces = WorkspacesStore.getState().workspaces;

  // Filter out the existing workspaces from the config's
  // workspaces. Note: we filter out existing workspaces only
  // after fetching all of them because the existing workspaces
  // may have changed in the time it takes to complete the
  // async processes above.
  const newWorkspaces = configWorkspaces.filter(
    (workspace) =>
      !existingWorkspaces.find(({ path }) => workspace.path === path),
  );

  // If there are no new workspaces, there is nothing to load
  if (newWorkspaces.length === 0) {
    return [];
  }

  // Load workspace paths into store
  WorkspacesStore.getState().load(newWorkspaces);

  // Dispatch a 'workspaces:load' event
  Events.dispatch('workspaces:load', newWorkspaces);

  return newWorkspaces;
}
