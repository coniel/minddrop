import { FileSystemChangedEventData } from '@minddrop/file-system';
import { Workspaces } from '@minddrop/workspaces';
import { DataViewsStore } from '../../DataViewsStore';
import { loadDataView } from '../../loadDataView';
import { resolveDataViewId } from '../../utils/resolveDataViewId';

/**
 * Applies a change made to a data view file outside of the app to
 * the store record of the workspace the change is in, ignoring
 * changes to any other file.
 *
 * @param change - The file system change.
 */
export async function onFileSystemChanged(
  change: FileSystemChangedEventData,
): Promise<void> {
  const workspace = Workspaces.get(change.workspaceId);
  const id = resolveDataViewId(change.path, workspace.path);

  // Not a data view file
  if (!id) {
    return;
  }

  const store = DataViewsStore.in(workspace.id);

  // Remove data views whose file is gone
  if (change.kind === 'deleted') {
    store.remove(id);

    return;
  }

  const view = await loadDataView(change.path, workspace.id);

  // The file is missing or is not a valid data view
  if (!view) {
    return;
  }

  // Update the store with the data view as it is on disk
  store.set(view);
}
