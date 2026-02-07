import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { ViewsStore } from '../ViewsStore';
import { ViewDeletedEvent } from '../events';
import { getView } from '../getView';

/**
 * Deletes a view, removing it from the store and deleting it from the file
 * system.
 *
 * @param viewId - The ID of the view to delete.
 *
 * @dispatches 'views:view:deleted' event
 */
export async function deleteView(viewId: string): Promise<void> {
  // Get the view
  const view = getView(viewId);

  // Delete the view from the store
  ViewsStore.remove(viewId);

  // Delete the view config from the file system
  await Fs.removeFile(view.path);

  // Dispatch the view deleted event
  Events.dispatch(ViewDeletedEvent, view);
}
