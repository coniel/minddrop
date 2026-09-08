import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { WorkspacesStore } from '../WorkspacesStore';
import { WorkspaceCreatedEvent } from '../events';
import { setActiveWorkspace } from '../setActiveWorkspace';
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
 * @throws {Fs.errors.PathConflict} If the workspace directory already exists.
 *
 * @dispatches workspaces:workspace:created
 * @dispatches workspaces:active-changed
 */
export async function createWorkspace(
  parentDirPath: string,
  options: CreateWorkspaceOptions,
): Promise<Workspace> {
  // The path to the workspace directory
  const path = Fs.concatPath(parentDirPath, options.name);

  // Ensure that the path does not already exist
  if (await Fs.exists(path)) {
    throw new Fs.errors.PathConflict(path);
  }

  // Create the workspace config
  const workspace = generateWorkspaceConfig({
    ...options,
    path,
  });

  // Add the workspace to the store
  WorkspacesStore.set(workspace);

  // Dispatch a workspace created event
  Events.dispatch(WorkspaceCreatedEvent, workspace);

  // Create the workspace directory
  await Fs.createDir(path);

  // Write the workspace config
  await writeWorkspaceConfig(workspace.id);

  // Write the workspaces config to add the new workspace path to it
  await writeWorkspacesConfig();

  // Make the new workspace active, once its configs have been written
  await setActiveWorkspace(workspace.id);

  // Return the new workspace
  return workspace;
}
