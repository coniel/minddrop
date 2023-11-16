import { Fs } from '@minddrop/file-system';
import { Events } from '@minddrop/events';
import { getWorkspace } from '../getWorkspace';
import { removeWorkspace } from '../removeWorkspace';

/**
 * Deletes a workspace dir and removes the workspace
 * from the store.
 *
 * Dispatches a 'workspaces:workspace:delete' event.
 *
 * @param path - The path of the workspace to remove.
 */
export async function deleteWorkspace(path: string): Promise<void> {
  // Get the workspace
  const workspace = getWorkspace(path);

  // Do nothing if the workspace does not exist
  if (!workspace) {
    return;
  }

  // Remove the workspace from the store
  await removeWorkspace(path);

  // Delete the workspace directory
  await Fs.trashDir(path);

  // Dispatch a 'workspaces:worspace:delete' event
  Events.dispatch('workspaces:workspace:delete', workspace);
}
