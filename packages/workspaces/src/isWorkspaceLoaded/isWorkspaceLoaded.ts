import { LoadedWorkspacesStore } from '../LoadedWorkspacesStore';

/**
 * Checks whether a workspace's content has been loaded into the
 * stores.
 *
 * @param id - The ID of the workspace to check.
 * @returns Whether the workspace is loaded.
 */
export function isWorkspaceLoaded(id: string): boolean {
  return LoadedWorkspacesStore.get('ids').some((loadedId) => loadedId === id);
}
