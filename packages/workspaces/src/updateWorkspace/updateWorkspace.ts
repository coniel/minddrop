import { Events } from '@minddrop/events';
import { InvalidParameterError } from '@minddrop/utils';
import { WorkspacesStore } from '../WorkspacesStore';
import { WorkspaceUpdatedEvent, WorkspaceUpdatedEventData } from '../events';
import { Workspace } from '../types';
import { writeWorkspaceConfig } from '../writeWorkspaceConfig';

export type UpdateWorkspaceData = Partial<Pick<Workspace, 'icon'>>;
/**
 * Updates a workspace.
 *
 * @param id - The ID of the workspace to update.
 * @param data - The updated workspace data.
 * @returns The updated workspace.
 */
export async function updateWorkspace(
  id: string,
  data: UpdateWorkspaceData,
): Promise<Workspace> {
  // Get the workspace
  const workspace = WorkspacesStore.get(id);

  // Prevent updating the workspace name
  if ('name' in data) {
    throw new InvalidParameterError(
      `Cannot update workspace name. Use Workspaces.rename() instead.`,
    );
  }

  // Update the workspace in the store
  WorkspacesStore.update(id, {
    ...data,
    lastModified: new Date(),
  });

  // Write the updated workspace config to the file system
  await writeWorkspaceConfig(id);

  // Get the updated workspace
  const updatedWorkspace = WorkspacesStore.get(id);

  // Dispatch a workspace updated event
  Events.dispatch<WorkspaceUpdatedEventData>(WorkspaceUpdatedEvent, {
    original: workspace,
    updated: updatedWorkspace,
  });

  // Return the updated workspace
  return updatedWorkspace;
}
