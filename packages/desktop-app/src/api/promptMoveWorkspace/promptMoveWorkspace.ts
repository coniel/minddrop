import { open } from '@tauri-apps/api/dialog';
import { Workspaces } from '@minddrop/workspaces';

/**
 * Opens a directory selection dialog and moves the workspace
 * at with the specified path to the selected directory.
 *
 * @param path - The target workspac path.
 */
export async function promptMoveWorkspace(path: string): Promise<void> {
  // Open a selection dialog for a directory
  const selected = await open({
    multiple: false,
    directory: true,
  });

  if (typeof selected === 'string') {
    // Move the the workspace to the selected directory
    return await Workspaces.move(path, selected);
  }
}
