import { Events } from '@minddrop/events';
import { Fs, PathConflictError } from '@minddrop/file-system';
import { WorkspacesStore } from '../WorkspacesStore';
import { WorkspaceCreatedEvent, WorkspaceCreatedEventData } from '../events';
import { Workspace } from '../types';
import { generateWorkspaceConfig } from '../utils';
import { writeWorkspaceConfig } from '../writeWorkspaceConfig';
import { writeWorkspacesConfig } from '../writeWorkspacesConfig';

type CreateWorkspaceOptions = Pick<Workspace, 'name' | 'icon'>;

/**
 * Creates a new workspace.
 *
 * @param parentDirPath - The path to the parent directory where the workspace directory will be created.
 * @param options - The workspace creation options.
 * @returns The generated workspace.
 *
 * @throws {PathConflictError} If the workspace directory already exists.
 */
export async function createWorkspace(
  parentDirPath: string,
  options: CreateWorkspaceOptions,
): Promise<Workspace> {
  // The path to the workspace directory
  const path = Fs.concatPath(parentDirPath, options.name);

  // Ensure that the path does not already exist
  if (await Fs.exists(path)) {
    throw new PathConflictError(path);
  }

  // Create the workspace config
  const workspace = generateWorkspaceConfig({
    ...options,
    path,
  });

  // Add the workspace to the store
  WorkspacesStore.add(workspace);

  // Create the workspace directory
  await Fs.createDir(path);

  // Write the workspace config
  await writeWorkspaceConfig(workspace.id);

  // Write the workspaces config to add the new workspace path to it
  await writeWorkspacesConfig();

  // Dispatch a workspace created event
  Events.dispatch<WorkspaceCreatedEventData>(WorkspaceCreatedEvent, workspace);

  // Return the new workspace
  return workspace;
}
