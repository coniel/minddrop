import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { ViewsStore } from '../ViewsStore';
import { ViewDeletedEvent, ViewDeletedEventData } from '../events';
import { getView } from '../getView';
import { getViewFilePath } from '../utils';

/**
 * Deletes a view, removing it from the store and deleting the file.
 *
 * @param id - The ID of the view to delete.
 *
 * @throws {ViewNotFoundError} If the view with the specified ID does not exist.
 *
 * @dispatches views:view:deleted
 */
export async function deleteView(id: string): Promise<void> {
  // Get the view
  const view = getView(id);

  // Remove the view from the store
  ViewsStore.remove(id);

  // Delete the view file
  await Fs.removeFile(getViewFilePath(id));

  // Dispatch a view deleted event
  Events.dispatch<ViewDeletedEventData>(ViewDeletedEvent, view);
}
