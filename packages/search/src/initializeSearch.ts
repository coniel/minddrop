import { Workspaces } from '@minddrop/workspaces';
import { getSearchAdapter } from './SearchAdapter';
import { initializeSearchSync } from './initializeSearchSync';

/**
 * Initializes MiniSearch for the current workspace and
 * registers event listeners for incremental sync.
 *
 * Should be called after `Databases.initialize()` has
 * completed.
 *
 * @param schemaChanged - Whether the SQL schema changed,
 *   requiring a full index rebuild.
 */
export async function initializeSearch({
  schemaChanged,
}: {
  schemaChanged: boolean;
}): Promise<void> {
  const workspaces = Workspaces.getAll();

  if (workspaces.length === 0) {
    return;
  }

  // Use the first workspace for now
  // TODO: Support multiple workspaces
  const workspaceId = workspaces[0].id;

  // Initialize MiniSearch on the backend
  await getSearchAdapter().searchInitialize({
    workspaceId,
    schemaChanged,
  });

  // Register event listeners for incremental sync
  initializeSearchSync();
}
