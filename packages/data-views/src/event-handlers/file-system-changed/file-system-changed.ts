import { FileSystemChangedEventData } from '@minddrop/file-system';
import { DataViewsStore } from '../../DataViewsStore';
import { loadDataView } from '../../loadDataView';
import { resolveDataViewId } from '../../utils/resolveDataViewId';

/**
 * Applies a change made to a data view file outside of the app,
 * ignoring changes to any other file.
 *
 * @param change - The file system change.
 */
export async function onFileSystemChanged(
  change: FileSystemChangedEventData,
): Promise<void> {
  const id = resolveDataViewId(change.path);

  // Not a data view file
  if (!id) {
    return;
  }

  // Remove data views whose file is gone
  if (change.kind === 'deleted') {
    DataViewsStore.remove(id);

    return;
  }

  const view = await loadDataView(change.path);

  // The file is missing or is not a valid data view
  if (!view) {
    return;
  }

  // Update the store with the data view as it is on disk
  DataViewsStore.set(view);
}
