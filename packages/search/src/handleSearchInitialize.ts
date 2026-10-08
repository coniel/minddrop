import { rebuildSearchIndex } from './rebuildSearchIndex';

/**
 * Back-end only. Initializes MiniSearch for a workspace by
 * building its index from SQL.
 *
 * @param workspaceId - The workspace to initialize search for.
 */
export async function handleSearchInitialize({
  workspaceId,
}: {
  workspaceId: string;
}): Promise<void> {
  // Build the workspace's index
  rebuildSearchIndex(workspaceId);
}
