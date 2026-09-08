import { Events } from '@minddrop/events';
import { ActiveWorkspaceStore } from '../ActiveWorkspaceStore';
import { ActiveWorkspaceChangedEvent } from '../events';
import { getWorkspace } from '../getWorkspace';
import { writeWorkspacesConfig } from '../writeWorkspacesConfig';

/**
 * Sets the active workspace, the one the app opens into.
 *
 * Does not update `Paths`, which describe the running session and are
 * derived anew when workspaces are next initialized.
 *
 * @param id - The ID of the workspace to make active.
 *
 * @throws {WorkspaceNotFoundError} If the workspace with the specified ID does not exist.
 *
 * @dispatches workspaces:active-changed
 */
export async function setActiveWorkspace(id: string): Promise<void> {
  // Get the workspace
  const workspace = getWorkspace(id);

  // Nothing to do if the workspace is already active
  if (ActiveWorkspaceStore.get('id') === workspace.id) {
    return;
  }

  // Set the workspace as active
  ActiveWorkspaceStore.set('id', workspace.id);

  // Dispatch an active workspace changed event
  Events.dispatch(ActiveWorkspaceChangedEvent, workspace);

  // Write the workspaces config to persist the active workspace path
  await writeWorkspacesConfig();
}
