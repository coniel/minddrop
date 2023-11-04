import { Events } from '@minddrop/events';
import { getWorkspace } from '../getWorkspace';
import { WorkspacesStore } from '../WorkspacesStore';

/**
 * Removes a workspace from the store.
 * Dispatches a 'workspaces:workspace:remove' event.
 *
 * @param path - The workspace path.
 */
export function removeWorkspace(path: string): void {
  // Get the workspace
  const workspace = getWorkspace(path);

  // Do nothing if workspace does not exist
  if (!workspace) {
    return;
  }

  // Remove the workspace from the store
  WorkspacesStore.getState().remove(path);

  // Dispatch a 'workspaces:workspace:remove' event
  Events.dispatch('workspaces:workspace:remove', workspace);
}
