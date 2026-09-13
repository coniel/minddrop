import { Events } from '@minddrop/events';
import {
  dropWorkspaceRecords,
  setActiveWorkspaceScope,
} from '@minddrop/stores';
import { ActiveWorkspaceStore } from '../ActiveWorkspaceStore';
import { LoadedWorkspacesStore } from '../LoadedWorkspacesStore';
import { WorkspacesStore } from '../WorkspacesStore';
import { WorkspaceDeletedEvent } from '../events';
import { getWorkspace } from '../getWorkspace';
import { setActiveWorkspace } from '../setActiveWorkspace';
import { writeWorkspacesConfig } from '../writeWorkspacesConfig';

/**
 * Removes a workspace from the store without deleting the directory,
 * dropping its records from every workspace scoped store. Removing
 * the active workspace makes the first remaining workspace active.
 *
 * @param id - The ID of the workspace to remove.
 *
 * @dispatches workspaces:active-changed
 * @dispatches workspaces:workspace:deleted
 */
export async function removeWorkspace(id: string): Promise<void> {
  // Get the workspace
  const workspace = getWorkspace(id);

  // Switch away from the workspace before removing it, so that the
  // active workspace never points at a removed one.
  if (ActiveWorkspaceStore.get('id') === workspace.id) {
    // Fall back to the first remaining workspace, if there is one
    const replacement = WorkspacesStore.getAllArray().find(
      (candidate) => candidate.id !== workspace.id,
    );

    if (replacement) {
      await setActiveWorkspace(replacement.id);
    } else {
      ActiveWorkspaceStore.set('id', null);

      // Point workspace scoped stores at no workspace
      setActiveWorkspaceScope(null);
    }
  }

  // Remove the workspace from the store
  WorkspacesStore.remove(id);

  // Dispatch a workspace deleted event
  Events.dispatch(WorkspaceDeletedEvent, workspace);

  // Mark the workspace as no longer loaded
  LoadedWorkspacesStore.set(
    'ids',
    LoadedWorkspacesStore.get('ids').filter(
      (loadedId) => loadedId !== workspace.id,
    ),
  );

  // Drop the workspace's records from every workspace scoped store
  dropWorkspaceRecords(workspace.id);

  // Write the workspaces config to remove the workspace path from it
  await writeWorkspacesConfig();
}
