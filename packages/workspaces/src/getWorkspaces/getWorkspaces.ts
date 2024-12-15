import { WorkspacesStore } from '../WorkspacesStore';
import { Workspace } from '../types';

/**
 * Returns all workspaces from the WorkspacesStore.
 *
 * @returns An array of workspaces.
 */
export function getWorkspaces(): Workspace[] {
  return WorkspacesStore.getState().workspaces;
}
