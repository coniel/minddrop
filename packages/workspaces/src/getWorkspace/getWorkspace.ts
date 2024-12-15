import { WorkspacesStore } from '../WorkspacesStore';
import { Workspace } from '../types';

/**
 * Returns a workspace by path, or null if it does not exist.
 *
 * @param path - The workspace path.
 * @returns A workspace or null.
 */
export function getWorkspace(path: string): Workspace | null {
  return (
    WorkspacesStore.getState().workspaces.find(
      (workspace) => workspace.path === path,
    ) || null
  );
}
