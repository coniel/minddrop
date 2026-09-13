import { getActiveWorkspace } from '../../getActiveWorkspace';
import { getWorkspace } from '../../getWorkspace';

/**
 * Returns the path of a workspace's directory, the active workspace's
 * when no workspace is given.
 *
 * @param workspaceId - The workspace whose path to resolve. Omit for the active workspace.
 * @returns The workspace's path.
 *
 * @throws {WorkspaceNotFoundError} If the workspace does not exist, or no workspace is active when none is given.
 */
export function resolveWorkspacePath(workspaceId?: string): string {
  if (workspaceId) {
    return getWorkspace(workspaceId).path;
  }

  return getActiveWorkspace().path;
}
