import { Fs } from '@minddrop/file-system';
import { getWorkspace } from '../getWorkspace';
import { removeWorkspace } from '../removeWorkspace';

/**
 * Deletes a workspace, removing it from the store and deleting the directory.
 *
 * @param id - The ID of the workspace to delete.
 *
 * @dispatches workspaces:workspace:deleted
 */
export async function deleteWorkspace(id: string): Promise<void> {
  // Get the workspace
  const workspace = getWorkspace(id);

  // Delete the workspace directory
  await Fs.removeDir(workspace.path);

  // Remove the workspace from the store
  removeWorkspace(id);
}
