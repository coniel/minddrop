import { Fs, InvalidPathError, PathConflictError } from '@minddrop/file-system';
import { Events } from '@minddrop/events';
import { Workspace } from '../types';
import { addWorkspace } from '../addWorkspace';

/**
 * Creates a new workspace directory and adds it to the
 * WorkspaceStore. Dispatches a 'workspaces:workspace:create'
 * event.
 *
 * @param location - The location at which to create the workspace directory (with or without trailing `/`).
 * @param name - The workspace name.
 * @returns The new workspace.
 *
 * @throws InvalidPathError - location path does not exist.
 * @throws PathConflictError - workspace path already exists.
 */
export async function createWorkspace(
  location: string,
  name: string,
): Promise<Workspace> {
  // Create workspace path
  const workspacePath = Fs.concatPath(location, name);

  // Ensure location exists
  if (!(await Fs.exists(location))) {
    throw new InvalidPathError(location);
  }

  // Ensure workspace path does not already exist
  if (await Fs.exists(workspacePath)) {
    throw new PathConflictError(workspacePath);
  }

  // Create workspace dir
  await Fs.createDir(workspacePath);

  // Add to workspaces
  const workspace = await addWorkspace(workspacePath);

  // Dispatch a 'workspaces:workspace:create' event
  Events.dispatch('workspaces:workspace:create', workspace);

  return workspace;
}
