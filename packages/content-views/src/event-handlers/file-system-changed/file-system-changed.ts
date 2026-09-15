import { FileSystemChangedEventData } from '@minddrop/file-system';
import { Workspaces } from '@minddrop/workspaces';
import { ContentViewsStore } from '../../ContentViewsStore';
import { loadContentView } from '../../loadContentView';
import { resolveContentViewId } from '../../utils/resolveContentViewId';

/**
 * Applies a change made to a content view file outside of the app to
 * the store record of the workspace the change is in, ignoring
 * changes to any other file.
 *
 * @param change - The file system change.
 */
export async function onFileSystemChanged(
  change: FileSystemChangedEventData,
): Promise<void> {
  const workspace = Workspaces.get(change.workspaceId);
  const id = resolveContentViewId(change.path, workspace.path);

  // Not a content view file
  if (!id) {
    return;
  }

  const store = ContentViewsStore.in(workspace.id);

  // Remove content views whose file is gone
  if (change.kind === 'deleted') {
    store.remove(id);

    return;
  }

  const view = await loadContentView(change.path, workspace.id);

  // The file is missing or is not a valid content view
  if (!view) {
    return;
  }

  // Update the store with the content view as it is on disk
  store.set(view);
}
