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
  // Get the user's workspaces config
  const workspacesConfig = await getWorkspacesConfig();

  // Get workspaces listed in the config
  const workspaces: Workspace[] = await Promise.all(
    workspacesConfig.paths.map(getWorkspaceFromPath),
  );

  // Load workspace paths into store
  WorkspacesStore.getState().load(workspaces);

  // Dispatch a 'workspaces:load' event
  Events.dispatch('workspaces:load', workspaces);

  return workspaces;
}
