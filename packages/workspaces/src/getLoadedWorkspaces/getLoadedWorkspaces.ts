import { LoadedWorkspacesStore } from '../LoadedWorkspacesStore';
import { WorkspacesStore } from '../WorkspacesStore';
import { Workspace } from '../types';

/**
 * Returns the workspaces whose content has been loaded into the
 * stores, in the order they loaded.
 *
 * @returns The loaded workspaces.
 */
export function getLoadedWorkspaces(): Workspace[] {
  return WorkspacesStore.getArray(LoadedWorkspacesStore.get('ids'));
}
