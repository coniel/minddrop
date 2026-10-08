import { Workspace } from '@minddrop/workspaces';
import { getSearchAdapter } from './SearchAdapter';

/**
 * Loads a workspace's search index on the backend from SQL.
 *
 * Should be called after the workspace's databases have loaded.
 *
 * @param workspace - The workspace whose search index to load.
 */
export async function loadWorkspaceSearch(workspace: Workspace): Promise<void> {
  // Build the index on the backend
  await getSearchAdapter().searchInitialize({ workspaceId: workspace.id });
}
