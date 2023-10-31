import { Workspace } from '../types';
import { WorkspacesStore } from '../WorkspacesStore';

/**
 * Returns all workspaces from the WorkspacesStore.
 *
 * @returns An array of workspaces.
 */
export function getWorkspaces(): Workspace[] {
  return WorkspacesStore.getState().workspaces;
}
