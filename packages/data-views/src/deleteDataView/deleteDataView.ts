import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { DataViewsStore } from '../DataViewsStore';
import { DataViewDeletedEvent } from '../events';
import { getDataView } from '../getDataView';
import { resolveViewFilePath } from '../utils';

/**
 * Deletes a data view, removing it from the store and deleting the file.
 *
 * @param id - The ID of the data view to delete.
 *
 * @throws {DataViewNotFoundError} If the data view with the specified ID does not exist.
 *
 * @dispatches data-views:data-view:deleted
 */
export async function deleteDataView(id: string): Promise<void> {
  // Get the data view
  const view = getDataView(id);

  // Remove the data view from the store
  DataViewsStore.remove(id);

  // Dispatch a data view deleted event
  Events.dispatch(DataViewDeletedEvent, view);

  // Delete the data view file from the file system if not virtual
  if (!view.virtual) {
    await Fs.removeFile(resolveViewFilePath(id));
  }
}
