import { Workspace } from '../types';
import { WorkspacesStore as useWorkspacesStore } from '../WorkspacesStore';

/**
 * Returns a workspace from the given path, or `null` if there is
 * no workspace with the given path.
 *
 * @param path - Absolute path to the workspace directory.
 * @returns A workspace object.
 */
export function useWorkspace(path: string): Workspace | null {
  return (
    useWorkspacesStore().workspaces.find(
      (workspace) => workspace.path === path,
    ) || null
  );
}
