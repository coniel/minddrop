import { FileSystemChangedEventData } from '@minddrop/file-system';
import { Workspaces } from '@minddrop/workspaces';
import { QueriesStore } from '../../QueriesStore';
import { readQuery } from '../../readQuery';
import { resolveQueryId } from '../../utils';

/**
 * Applies a change made to a query file outside of the app to the
 * store record of the workspace the change is in, ignoring changes
 * to any other file.
 *
 * @param change - The file system change.
 */
export async function onFileSystemChanged(
  change: FileSystemChangedEventData,
): Promise<void> {
  const workspace = Workspaces.get(change.workspaceId);
  const id = resolveQueryId(change.path, workspace.path);

  // Not a query file
  if (!id) {
    return;
  }

  const store = QueriesStore.in(workspace.id);

  // Remove queries whose file is gone
  if (change.kind === 'deleted') {
    store.remove(id);

    return;
  }

  const query = await readQuery(change.path);

  // The file is missing or is not a valid query
  if (!query) {
    return;
  }

  // Update the store with the query as it is on disk
  store.set(query);
}
