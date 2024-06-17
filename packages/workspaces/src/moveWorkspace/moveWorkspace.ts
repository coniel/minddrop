import { Fs, InvalidPathError, PathConflictError } from '@minddrop/file-system';
import { Events } from '@minddrop/events';
import { getWorkspace } from '../getWorkspace';
import { WorkspacesStore } from '../WorkspacesStore';
import { writeWorkspacesConfig } from '../writeWorkspacesConfig';

/**
 * Moves a workspace folder to a new location and updates
 * the workspaces config file. Dispatches a
 * 'workspaces:workspace:move' event.
 *
 * @param path - The current workspace path.
 * @param destinationPath - The path to which to move the workspace dir.
 *
 * @throws {InvalidPathError} - Destination or workspace path does not exist.
 * @throws {PathConflictError} - A dir of the same name already exists in the destination dir.
 */
export async function moveWorkspace(
  path: string,
  destinationPath: string,
): Promise<void> {
  // Get the workspace from the store
  const workspace = getWorkspace(path);
  // Get workspace dir name from its path
  const workspaceDir = Fs.fileNameFromPath(path);
  // Generate the new workspace path
  const newPath = Fs.concatPath(destinationPath, workspaceDir);

  if (!workspace) {
    return;
  }

  // Ensure workspace dir exists
  if (!(await Fs.exists(path))) {
    throw new InvalidPathError(destinationPath);
  }

  // Ensure destination dir exists
  if (!(await Fs.exists(destinationPath))) {
    throw new InvalidPathError(destinationPath);
  }

  // Ensure there is no conflict
  if (await Fs.exists(newPath)) {
    throw new PathConflictError(newPath);
  }

  // Move the workspace dir
  await Fs.rename(path, newPath);

  // Remove old version of the workspace
  WorkspacesStore.getState().remove(path);
  // Add new version of the workspace
  WorkspacesStore.getState().add({ ...workspace, path: newPath });

  // Update workspaces config file
  await writeWorkspacesConfig();

  // Dispatch a 'workspaces:workspace:move' event
  Events.dispatch('workspaces:workspace:move', { oldPath: path, newPath });
}
