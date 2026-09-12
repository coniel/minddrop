import { Workspace } from '@minddrop/workspaces';
import { loadTagGroups } from '../loadTagGroups';
import { loadTags } from '../loadTags';

/**
 * Loads a workspace's tags and tag groups into the workspace's
 * store records.
 *
 * @param workspace - The workspace whose tags to load.
 */
export async function loadWorkspaceTags(workspace: Workspace): Promise<void> {
  await loadTags(workspace);
  await loadTagGroups(workspace);
}
