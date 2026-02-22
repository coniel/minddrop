import { Events } from '@minddrop/events';
import { FileNotFoundError, Fs } from '@minddrop/file-system';
import { InvalidParameterError } from '@minddrop/utils';
import { WorkspacesStore } from '../WorkspacesStore';
import { WorkspacesLoadedEvent, WorkspacesLoadedEventData } from '../events';
import { readWorkspaceConfig } from '../readWorkspaceConfig';
import { Workspace } from '../types';
import { generateWorkspaceConfig } from '../utils';
import { writeWorkspaceConfig } from '../writeWorkspaceConfig';
import { writeWorkspacesConfig } from '../writeWorkspacesConfig';

/**
 * Adds a workspace from a directory. If the directory is an existing MindDrop
 * workspace, it is simply added to the store. Otherwise, a new workspace is
 * initialized and added to the store.
 *
 * @param path - The path to the workspace directory.
 * @returns The added workspace.
 *
 * @throws {FileNotFoundError} If the workspace directory does not exist.
 *
 * @dispatches worksapces:loaded
 */
export async function addWorkspace(path: string): Promise<Workspace> {
  // Ensure the path exists
  if (!(await Fs.exists(path))) {
    throw new FileNotFoundError(path);
  }

  // Ensure the path is a directory
  if (!(await Fs.isDirectory(path))) {
    throw new InvalidParameterError('Path is not a directory');
  }

  // Check if the workspace is already in the store. If so, return it
  // without adding it again.
  const existingWorkspace = WorkspacesStore.getAll().find(
    (workspace) => workspace.path === path,
  );

  if (existingWorkspace) {
    return existingWorkspace;
  }

  // Attempt to read the workspace config
  let workspace = await readWorkspaceConfig(path, false);

  if (!workspace) {
    // If the directory is not a workspace, initialize it
    workspace = generateWorkspaceConfig({
      path,
      name: Fs.fileNameFromPath(path),
      icon: 'content-icon:box:default',
    });

    // Add the workspace to the store
    WorkspacesStore.add(workspace);

    // Write the workspace config
    await writeWorkspaceConfig(workspace.id);
  } else {
    // If the workspace exists, add it to the store
    WorkspacesStore.add(workspace);
  }

  // Write the workspaces config to add the new workspace path to it
  await writeWorkspacesConfig();

  // Dispatch a workspaces loaded event
  Events.dispatch<WorkspacesLoadedEventData>(WorkspacesLoadedEvent, [
    workspace,
  ]);

  // Return the added workspace
  return workspace;
}
