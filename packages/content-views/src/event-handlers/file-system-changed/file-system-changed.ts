import { FileSystemChangedEventData, Fs } from '@minddrop/file-system';
import { Workspaces } from '@minddrop/workspaces';
import { ContentViewsStore } from '../../ContentViewsStore';
import { loadContentView } from '../../loadContentView';
import { unloadContentView } from '../../unloadContentView';
import { resolveContentViewId } from '../../utils/resolveContentViewId';

/**
 * Applies a change made to a content view file outside of the app to
 * its workspace's store record. Ignores changes to any other file.
 *
 * @param change - The file system change.
 */
export async function onFileSystemChanged(
  change: FileSystemChangedEventData,
): Promise<void> {
  // Get the change's workspace
  const workspace = Workspaces.get(change.workspaceId);
  // Get the ID of the content view the changed file holds
  const id = resolveContentViewId(change.path, workspace.path);

  // Ignore files which are not content view files
  if (!id) {
    return;
  }

  // Check if the file is gone, whatever the change's kind. If so,
  // remove the content view. An atomic save reports a deleted file
  // which still exists.
  if (!(await Fs.exists(change.path))) {
    unloadContentView(id, workspace.id);

    return;
  }

  // Read the content view as it is on disk
  const view = await loadContentView(change.path, workspace.id);

  // Leave the store as it is if the existing file is not a valid
  // content view. An unreadable file is not a deleted one.
  if (!view) {
    return;
  }

  // Update the store with the content view as it is on disk
  ContentViewsStore.in(workspace.id).set(view);
}
