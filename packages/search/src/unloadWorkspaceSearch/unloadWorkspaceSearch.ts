import { getSearchAdapter } from '../SearchAdapter';
import { discardSearchSyncBatch } from '../searchSyncBatch';

/**
 * Unloads a workspace's search index: drops the changes buffered
 * for it and has the backend drop the index itself.
 *
 * @param workspaceId - The workspace whose index to unload.
 */
export async function unloadWorkspaceSearch(
  workspaceId: string,
): Promise<void> {
  // Changes still buffered would recreate the index once flushed
  discardSearchSyncBatch(workspaceId);

  await getSearchAdapter().searchUnload({ workspaceId });
}
