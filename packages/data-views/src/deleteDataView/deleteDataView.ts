import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { Workspaces } from '@minddrop/workspaces';
import { DataViewsStore } from '../DataViewsStore';
import { DataViewDeletedEvent } from '../events';
import { getDataView } from '../getDataView';
import { resolveViewFilePath } from '../utils';

/**
 * Deletes a data view, removing it from the store and deleting the file.
 *
 * @param id - The ID of the data view to delete.
 * @param workspaceId - The workspace the data view belongs to. Omit for the active workspace.
 *
 * @throws {DataViewNotFoundError} If the data view with the specified ID does not exist.
 *
 * @dispatches data-views:data-view:deleted
 */
export async function deleteDataView(
  id: string,
  workspaceId?: string,
): Promise<void> {
  // Get the data view
  const view = getDataView(id, true, workspaceId);

  // Remove the data view from the workspace's store record
  DataViewsStore.in(workspaceId).remove(id);

  // Dispatch a data view deleted event
  Events.dispatch(DataViewDeletedEvent, view);

  // Delete the data view file from the file system if not virtual
  if (!view.virtual) {
    await Fs.removeFile(
      resolveViewFilePath(id, Workspaces.resolvePath(workspaceId)),
    );
  }
}
