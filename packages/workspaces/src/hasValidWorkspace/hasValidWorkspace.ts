import { getWorkspaces } from '../getWorkspaces';

/**
 * Checks if there is at least one workspace in the
 * WorkspaceStore for which the directory exists.
 *
 * @returns A boolean indicating the existence of a valid workspace.
 */
export function hasValidWorkspace(): boolean {
  // Get all workspaces from the store
  const workspaces = getWorkspaces();

  // Ensure there are workspaces
  return workspaces.some((workspace) => workspace.exists);
}
