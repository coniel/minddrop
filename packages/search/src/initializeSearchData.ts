import { initializeSearchIndex, rebuildSearchIndex } from './searchIndex';

/**
 * Back-end only. Initializes MiniSearch for a workspace.
 * Forces a full rebuild if the SQL schema changed, otherwise
 * loads from disk if the persisted index is still valid.
 *
 * @param workspaceId - The workspace to initialize search for.
 * @param schemaChanged - Whether the SQL schema changed (requires full rebuild).
 */
export async function initializeSearchData(
  workspaceId: string,
  schemaChanged: boolean,
): Promise<void> {
  console.log(
    `[search] Initializing search index for workspace ${workspaceId}`,
  );

  if (schemaChanged) {
    await rebuildSearchIndex(workspaceId);
  } else {
    await initializeSearchIndex(workspaceId);
  }

  console.log(
    `[search] Search initialization complete for workspace ${workspaceId}`,
  );
}
