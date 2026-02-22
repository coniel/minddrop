import { Events } from '@minddrop/events';
import { Fs, PathConflictError } from '@minddrop/file-system';
import { WorkspacesStore } from '../WorkspacesStore';
import { WorkspaceUpdatedEvent } from '../events';
import { getWorkspace } from '../getWorkspace';
import { Workspace } from '../types';
import { writeWorkspaceConfig } from '../writeWorkspaceConfig';
import { writeWorkspacesConfig } from '../writeWorkspacesConfig';

/**
 * Renames a workspace.
 *
 * @param id - The ID of the workspace to rename.
 * @param newName - The new name of the workspace.
 * @returns The updated workspace.
 *
 * @throws {PathConflictError} If the new path is already taken.
 */
export async function renameWorkspace(
  id: string,
  newName: string,
): Promise<Workspace> {
  // Get the workspace
  const workspace = getWorkspace(id);
  // Create the new workspace path
  const newPath = Fs.concatPath(Fs.parentDirPath(workspace.path), newName);

  // If the name is unchanged, return the workspace as is
  if (newName === workspace.name) {
    return workspace;
  }

  // Ensure the new path does not already exist
  if (await Fs.exists(newPath)) {
    throw new PathConflictError(newPath);
  }

  // Rename the workspace directory
  await Fs.rename(workspace.path, newPath);

  // Update the workspace name and path
  const update = {
    name: newName,
    path: newPath,
    lastModified: new Date(),
  };

  // Update the workspace in the store
  WorkspacesStore.update(workspace.id, update);

  // Write the updated workspace config to the file system
  await writeWorkspaceConfig(id);

  // Write the workspaces config to update the workspace path in it
  await writeWorkspacesConfig();

  // Get the updated workspace
  const updatedWorkspace = getWorkspace(id);

  // Dispatch a workspace updated event
  Events.dispatch(WorkspaceUpdatedEvent, {
    original: workspace,
    updated: updatedWorkspace,
  });

  // Return the updated workspace
  return updatedWorkspace;
}
