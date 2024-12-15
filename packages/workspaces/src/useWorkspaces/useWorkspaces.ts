import { WorkspacesStore as useWorkspacesStore } from '../WorkspacesStore';
import { Workspace } from '../types';

/**
 * Returns the user's workspaces.
 *
 * @returns An array of Workspace objects.
 */
export function useWorkspaces(): Workspace[] {
  return useWorkspacesStore().workspaces;
}
