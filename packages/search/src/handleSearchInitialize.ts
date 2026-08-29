import { initializeSearchData } from './initializeSearchData';

/**
 * Back-end only. Initializes MiniSearch for a workspace.
 * Loads the persisted index from disk or rebuilds from
 * SQL if the schema changed.
 *
 * @param workspaceId - The workspace to initialize search for.
 * @param schemaChanged - Whether the SQL schema changed, requiring a full rebuild.
 */
export async function handleSearchInitialize({
  workspaceId,
  schemaChanged,
}: {
  workspaceId: string;
  schemaChanged: boolean;
}): Promise<void> {
  await initializeSearchData(workspaceId, schemaChanged);
}
