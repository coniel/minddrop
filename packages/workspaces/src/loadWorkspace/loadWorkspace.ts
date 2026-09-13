import { Events } from '@minddrop/events';
import { LoadedWorkspacesStore } from '../LoadedWorkspacesStore';
import { WorkspaceLoadersRegistry } from '../WorkspaceLoadersRegistry';
import { WorkspaceLoadedEvent } from '../events';
import { getWorkspace } from '../getWorkspace';
import { isWorkspaceLoaded } from '../isWorkspaceLoaded';
import { Workspace } from '../types';

// The loads in progress, keyed by workspace ID, so that concurrent
// calls for a workspace share one load.
const loads = new Map<string, Promise<void>>();

/**
 * Loads a workspace's content into the stores by running the
 * registered loaders in registration order. Does nothing for a
 * workspace which is already loaded, and joins the load in progress
 * for a workspace which is loading.
 *
 * @param id - The ID of the workspace to load.
 *
 * @throws {WorkspaceNotFoundError} If the workspace does not exist.
 *
 * @dispatches workspaces:workspace:loaded
 */
export async function loadWorkspace(id: string): Promise<void> {
  // Get the workspace
  const workspace = getWorkspace(id);

  // Nothing to do if the workspace is already loaded
  if (isWorkspaceLoaded(workspace.id)) {
    return;
  }

  // Join the load already in progress, if there is one
  const inProgress = loads.get(workspace.id);

  if (inProgress) {
    return inProgress;
  }

  // Run the loaders, forgetting the load once it settles
  const load = runLoaders(workspace).finally(() => loads.delete(workspace.id));

  loads.set(workspace.id, load);

  return load;
}

/**
 * Runs the registered loaders for a workspace, then marks it loaded.
 */
async function runLoaders(workspace: Workspace): Promise<void> {
  for (const loader of WorkspaceLoadersRegistry.getAll()) {
    await loader.load(workspace);
  }

  // Mark the workspace as loaded
  LoadedWorkspacesStore.set('ids', [
    ...LoadedWorkspacesStore.get('ids'),
    workspace.id,
  ]);

  // Dispatch a workspace loaded event
  Events.dispatch(WorkspaceLoadedEvent, workspace);
}
