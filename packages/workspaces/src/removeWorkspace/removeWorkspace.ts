import { Events } from '@minddrop/events';
import { ActiveWorkspaceStore } from '../ActiveWorkspaceStore';
import { WorkspacesStore } from '../WorkspacesStore';
import { ActiveWorkspaceChangedEvent, WorkspaceDeletedEvent } from '../events';
import { getWorkspace } from '../getWorkspace';
import { writeWorkspacesConfig } from '../writeWorkspacesConfig';

/**
 * Removes a workspace from the store without deleting the directory.
 * Removing the active workspace makes the first remaining workspace
 * active.
 *
 * @param id - The ID of the workspace to remove.
 *
 * @dispatches workspaces:workspace:deleted
 * @dispatches workspaces:active-changed
 */
export async function removeWorkspace(id: string): Promise<void> {
  // Get the workspace
  const workspace = getWorkspace(id);

  // Whether the workspace being removed is the active one
  const wasActive = ActiveWorkspaceStore.get('id') === workspace.id;

  // Remove the workspace from the store
  WorkspacesStore.remove(id);

  // Dispatch a workspace deleted event
  Events.dispatch(WorkspaceDeletedEvent, workspace);

  if (wasActive) {
    // Fall back to the first remaining workspace, if there is one
    const replacement = WorkspacesStore.getAllArray()[0];

    ActiveWorkspaceStore.set('id', replacement ? replacement.id : null);

    // Dispatch an active workspace changed event
    if (replacement) {
      Events.dispatch(ActiveWorkspaceChangedEvent, replacement);
    }
  }

  // Write the workspaces config to remove the workspace path from it
  await writeWorkspacesConfig();
}
