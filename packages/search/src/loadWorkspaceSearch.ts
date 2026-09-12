import { Workspace } from '@minddrop/workspaces';
import { getSearchAdapter } from './SearchAdapter';

export interface LoadWorkspaceSearchOptions {
  /**
   * Whether the SQL schema changed, requiring a full index rebuild.
   */
  schemaChanged: boolean;
}

/**
 * Loads a workspace's search index on the backend, rebuilding it
 * from SQL when the schema changed and from the persisted index
 * otherwise.
 *
 * Should be called after the workspace's databases have loaded.
 *
 * @param workspace - The workspace whose search index to load.
 * @param options - Whether the SQL schema changed.
 */
export async function loadWorkspaceSearch(
  workspace: Workspace,
  options: LoadWorkspaceSearchOptions,
): Promise<void> {
  await getSearchAdapter().searchInitialize({
    workspaceId: workspace.id,
    schemaChanged: options.schemaChanged,
  });
}
