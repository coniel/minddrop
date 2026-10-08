import { searchIndexes } from '../searchIndexStore';

/**
 * Back-end only. Drops a workspace's search index.
 *
 * @param workspaceId - The workspace whose index to drop.
 */
export function handleSearchUnload({
  workspaceId,
}: {
  workspaceId: string;
}): void {
  // Drop the index
  searchIndexes.delete(workspaceId);
}
