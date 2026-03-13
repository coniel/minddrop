import { Workspaces } from '@minddrop/workspaces';
import { getSearchAdapter } from './SearchAdapter';
import { initializeSearchSync } from './initializeSearchSync';

/**
 * Initializes MiniSearch for the current workspace and
 * registers event listeners for incremental sync.
 *
 * Should be called after `Databases.initializeSql()` has
 * completed.
 *
 * @param sqlResult - The result from SQL initialization,
 *   including schema change flag and any incrementally
 *   changed or deleted entries.
 */
export async function initializeSearch(sqlResult: {
  schemaChanged: boolean;
  changedEntries: { id: string; title: string; databaseId: string }[];
  deletedEntryIds: string[];
}): Promise<void> {
  const workspaces = Workspaces.getAll();

  if (workspaces.length === 0) {
    return;
  }

  // Use the first workspace for now
  // TODO: Support multiple workspaces
  const workspaceId = workspaces[0].id;

  // Initialize MiniSearch on the backend, passing through
  // the SQL result for incremental sync
  await getSearchAdapter().searchInitialize({
    workspaceId,
    ...sqlResult,
  });

  // Register event listeners for incremental sync
  initializeSearchSync();
}
