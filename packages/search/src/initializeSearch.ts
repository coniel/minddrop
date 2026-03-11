import { Databases } from '@minddrop/databases';
import { Workspaces } from '@minddrop/workspaces';
import { getSearchAdapter } from './SearchAdapter';
import { initializeSearchSync } from './initializeSearchSync';

/**
 * Initializes search by sending all loaded databases to the
 * backend for indexing and registering event listeners for
 * incremental sync.
 *
 * Should be called after databases have been loaded
 * (i.e. after `Databases.initialize()`).
 */
export async function initializeSearch(): Promise<void> {
  const workspaces = Workspaces.getAll();

  if (workspaces.length === 0) {
    return;
  }

  // Use the first workspace for now
  // TODO: Support multiple workspaces
  const workspaceId = workspaces[0].id;

  // Get all loaded databases
  const databases = Databases.getAll();

  // Send databases to the backend for indexing
  await getSearchAdapter().searchInitialize({ workspaceId, databases });

  // Register event listeners for incremental sync
  initializeSearchSync();
}
