import { cancelDebouncedPersist } from '../debouncedPersist';
import { searchIndexes } from '../searchIndexStore';

/**
 * Back-end only. Drops a workspace's search index, cancelling
 * any pending persist of it so that nothing writes the index file
 * after the workspace is gone.
 *
 * @param workspaceId - The workspace whose index to drop.
 */
export function handleSearchUnload({
  workspaceId,
}: {
  workspaceId: string;
}): void {
  cancelDebouncedPersist(workspaceId);
  searchIndexes.delete(workspaceId);
}
