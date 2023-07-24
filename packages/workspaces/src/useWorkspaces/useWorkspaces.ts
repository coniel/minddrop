import { Workspace } from '../types';
import { WorkspacesStore as useWorkspacesStore } from '../WorkspacesStore';

/**
 * Returns the user's workspaces.
 *
 * @returns An array of Workspace objects.
 */
export function useWorkspaces(): Workspace[] {
  return useWorkspacesStore().workspaces;
}
