import { WorkspaceIcon } from '../types';
import { WorkspacesStore } from '../WorkspacesStore';
import { writeWorkspaceConfig } from '../writeWorkspaceConfig';

/**
 * Sets the workspace icon and persists the change to the
 * workspace config file.
 *
 * @param path - The workspace path.
 * @param icon - The new icon.
 */
export async function setWorkpaceIcon(
  path: string,
  icon: WorkspaceIcon,
): Promise<void> {
  // Update the workspace in the store
  WorkspacesStore.getState().update(path, { icon });

  // Persist the change to the workspace config file
  await writeWorkspaceConfig(path);
}
