import { Events } from '@minddrop/events';
import { setActiveWorkspaceScope } from '@minddrop/stores';
import { ActiveWorkspaceStore } from '../ActiveWorkspaceStore';
import { ActiveWorkspaceChangedEvent } from '../events';
import { getWorkspace } from '../getWorkspace';

/**
 * Sets the active workspace, the one the app opens into and the one
 * workspace scoped stores read and write.
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

  // Set the workspace as active, which persists it
  ActiveWorkspaceStore.set('id', workspace.id);

  // Point workspace scoped stores at the workspace
  setActiveWorkspaceScope(workspace.id);

  // Let the write land before announcing the change: the desktop app
  // answers it by reloading the window, which would otherwise cut the
  // write short and reopen the workspace being left.
  await ActiveWorkspaceStore.persisted();

  // Dispatch an active workspace changed event
  Events.dispatch(ActiveWorkspaceChangedEvent, workspace);
}
