import { Events } from '@minddrop/events';
import { WorkspacesStore } from '../WorkspacesStore';
import { getWorkspace } from '../getWorkspace';
import { writeWorkspacesConfig } from '../writeWorkspacesConfig';

/**
 * Removes a workspaceace from the store but retains
 * the workspace dir.
 * Dispatches a 'workspaces:workspace:remove' event.
 *
 * @param path - The workspace path.
 */
export async function removeWorkspace(path: string): Promise<void> {
  // Get the workspace
  const workspace = getWorkspace(path);

  // Do nothing if workspace does not exist
  if (!workspace) {
    return;
  }

  // Remove the workspace from the store
  WorkspacesStore.getState().remove(path);

  // Update the workspaces config file
  await writeWorkspacesConfig();

  // Dispatch a 'workspaces:workspace:remove' event
  Events.dispatch('workspaces:workspace:remove', workspace);
}
