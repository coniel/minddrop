import { Fs } from '@minddrop/file-system';
import { getWorkspace } from '../getWorkspace';
import { removeWorkspace } from '../removeWorkspace';

/**
 * Deletes a workspace, removing it from the store and moving its
 * directory to the OS trash.
 *
 * @param id - The ID of the workspace to delete.
 *
 * @dispatches workspaces:workspace:deleted
 * @dispatches workspaces:active-changed
 */
export async function deleteWorkspace(id: string): Promise<void> {
  // Get the workspace
  const workspace = getWorkspace(id);

  // Move the workspace directory to the trash
  await Fs.trashDir(workspace.path);

  // Remove the workspace from the store
  await removeWorkspace(id);
}
