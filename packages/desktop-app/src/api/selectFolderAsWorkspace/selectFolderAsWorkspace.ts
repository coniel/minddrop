import { open } from '@tauri-apps/plugin-dialog';
import { Workspace, Workspaces } from '@minddrop/workspaces';

/**
 * Opens a directory selection dialog and adds the selected
 * directory as a workspace.
 *
 * @returns The added workspace or null if selection was canceled.
 */
export async function selectFolderAsWorkspace(): Promise<Workspace | null> {
  // Open a selection dialog for a directory
  const selected = await open({
    multiple: false,
    directory: true,
  });

  if (typeof selected === 'string') {
    // Add the selected directory as a workspace
    return await Workspaces.add(selected);
  }

  return null;
}
