import { Workspace } from '@minddrop/workspaces';
import { loadTags } from '../loadTags';

/**
 * Loads a workspace's tags into the store.
 *
 * @param workspace - The workspace to load the tags of.
 */
export async function loadWorkspaceTags(workspace: Workspace): Promise<void> {
  await loadTags(workspace);
}
