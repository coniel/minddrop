import { FileNotFoundError, Fs } from '@minddrop/core';
import { Events } from '@minddrop/events';
import { getWorkspaceFromPath } from '../getWorkspaceFromPath';
import { Workspace } from '../types';
import { WorkspacesStore } from '../WorkspacesStore';
import { writeWorkspacesConfig } from '../writeWorkspacesConfig';

/**
 * Adds a new workspace to the store and workspaces config file.
 * Emits a 'workspaces:workspace:add' event.
 *
 * @param path - Absolute path to the workspace directory.
 * @returns The new workspace.
 */
export async function addWorkspace(path: string): Promise<Workspace> {
  // Ensure path exists
  const exists = await Fs.exists(path);

  if (!exists) {
    throw new FileNotFoundError(path);
  }

  // Create workspace object
  const workspace = await getWorkspaceFromPath(path);

  // Add workspace to store
  WorkspacesStore.getState().add(workspace);

  // Persist new workspace to workspaces config file
  writeWorkspacesConfig();

  // Dispatch a 'workspaces:workspace:add' event
  Events.dispatch('workspaces:workspace:add', workspace);

  return workspace;
}
