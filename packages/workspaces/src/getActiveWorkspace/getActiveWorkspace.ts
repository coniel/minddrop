import { ActiveWorkspaceStore } from '../ActiveWorkspaceStore';
import { WorkspacesStore } from '../WorkspacesStore';
import { WorkspaceNotFoundError } from '../errors';
import { Workspace } from '../types';

/**
 * Retrieves the active workspace.
 *
 * @param throwOnNotFound - Whether to throw an error if there is no active workspace.
 * @returns The active workspace.
 *
 * @throws {WorkspaceNotFoundError} If there is no active workspace.
 */
export function getActiveWorkspace(): Workspace;
export function getActiveWorkspace(throwOnNotFound: false): Workspace | null;
export function getActiveWorkspace(throwOnNotFound = true): Workspace | null {
  // Get the active workspace ID
  const id = ActiveWorkspaceStore.get('id');

  // Get the workspace from the store
  const workspace = id ? WorkspacesStore.get(id) : null;

  // Throw an error if there is no active workspace, unless specified not to
  if (!workspace && throwOnNotFound) {
    throw new WorkspaceNotFoundError(id ?? 'active');
  }

  return workspace;
}
