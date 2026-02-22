import { Events } from '@minddrop/events';
import { WorkspacesStore } from '../WorkspacesStore';
import { WorkspaceDeletedEvent, WorkspaceDeletedEventData } from '../events';
import { getWorkspace } from '../getWorkspace';
import { writeWorkspacesConfig } from '../writeWorkspacesConfig';

/**
 * Removes a workspace from the store without deleting the directory.
 *
 * @param id - The ID of the workspace to remove.
 *
 * @dispatches workspaces:workspace:deleted
 */
export async function removeWorkspace(id: string): Promise<void> {
  // Get the workspace
  const workspace = getWorkspace(id);

  // Remove the workspace from the store
  WorkspacesStore.remove(id);

  // Write the workspaces config to remove the workspace path from it
  await writeWorkspacesConfig();

  // Dispatch a workspace deleted event
  Events.dispatch<WorkspaceDeletedEventData>(WorkspaceDeletedEvent, workspace);
}
