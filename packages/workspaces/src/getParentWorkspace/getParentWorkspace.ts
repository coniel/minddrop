import { getWorkspaces } from '../getWorkspaces';
import { Workspace } from '../types';

/**
 * Returns the parent workspace of the specified child path.
 *
 * @param childPath - Path of the child document.
 * @returns The parent workspace of the child path, or null if the parent workspace does not exist.
 */
export function getParentWorkspace(childPath: string): Workspace | null {
  const workspaces = getWorkspaces();
  const childPathParts = childPath.split('/');

  // Check if the child path is a sub-path of a workspace.
  // Compare each part of the child path to the corresponding
  // part of the workspace path in order to avoid matching
  // workspaces with similar paths.
  for (const workspace of workspaces) {
    const workspacePathParts = workspace.path.split('/');

    if (childPathParts.length > workspacePathParts.length) {
      const isParentWorkspace = workspacePathParts.every((part, index) => {
        return part === childPathParts[index];
      });

      if (isParentWorkspace) {
        return workspace;
      }
    }
  }

  return null;
}
