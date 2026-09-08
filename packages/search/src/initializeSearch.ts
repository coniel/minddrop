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
  const workspace = Workspaces.getActive(false);

  if (!workspace) {
    return;
  }

  const workspaceId = workspace.id;

  // Initialize MiniSearch on the backend
  await getSearchAdapter().searchInitialize({
    workspaceId,
    schemaChanged,
  });

  // Register event listeners for incremental sync
  initializeSearchSync();
}
