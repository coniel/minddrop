import { WorkspacesStore } from '../WorkspacesStore';
import { WorkspaceNotFoundError } from '../errors';
import { Workspace } from '../types';

/**
 * Retrieves a workspace by its ID.
 *
 * @param id - The ID of the workspace to retrieve.
 * @returns The workspace.
 *
 * @throws {WorkspaceNotFoundError} If the workspace with the specified ID does not exist.
 */
export function getWorkspace(id: string): Workspace {
  // Get the workspace from the store
  const workspace = WorkspacesStore.get(id);

  // Ensure the workspace exists
  if (!workspace) {
    throw new WorkspaceNotFoundError(id);
  }

  return workspace;
}
