import { FileSystemChangedEventData } from '@minddrop/file-system';
import { QueriesStore } from '../../QueriesStore';
import { readQuery } from '../../readQuery';
import { resolveQueryId } from '../../utils';

/**
 * Applies a change made to a query file outside of the app,
 * ignoring changes to any other file.
 *
 * @param change - The file system change.
 */
export async function onFileSystemChanged(
  change: FileSystemChangedEventData,
): Promise<void> {
  const id = resolveQueryId(change.path);

  // Not a query file
  if (!id) {
    return;
  }

  // Remove queries whose file is gone
  if (change.kind === 'deleted') {
    QueriesStore.remove(id);

    return;
  }

  const query = await readQuery(change.path);

  // The file is missing or is not a valid query
  if (!query) {
    return;
  }

  // Update the store with the query as it is on disk
  QueriesStore.set(query);
}
