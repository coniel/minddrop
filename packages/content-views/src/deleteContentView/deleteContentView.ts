import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { Workspaces } from '@minddrop/workspaces';
import { ContentViewsStore } from '../ContentViewsStore';
import { ContentViewDeletedEvent } from '../events';
import { getContentView } from '../getContentView';
import { resolveContentViewFilePath } from '../utils';

/**
 * Deletes a content view, removing it from the store and deleting the file.
 *
 * @param id - The ID of the content view to delete.
 * @param workspaceId - The workspace the content view belongs to. Omit for the active workspace.
 *
 * @throws {ContentViewNotFoundError} If the content view with the specified ID does not exist.
 *
 * @dispatches content-views:content-view:deleted
 */
export async function deleteContentView(
  id: string,
  workspaceId?: string,
): Promise<void> {
  // Get the content view
  const view = getContentView(id, true, workspaceId);

  // Remove the content view from the workspace's store record
  ContentViewsStore.in(workspaceId).remove(id);

  // Dispatch a content view deleted event
  Events.dispatch(ContentViewDeletedEvent, view);

  // Delete the content view file from the file system if not virtual
  if (!view.virtual) {
    await Fs.removeFile(
      resolveContentViewFilePath(id, Workspaces.resolvePath(workspaceId)),
    );
  }
}
