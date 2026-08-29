import type MiniSearch from 'minisearch';
import { searchIndexes } from './searchIndexStore';
import type { SearchDocument } from './types';

/**
 * Returns the first initialized workspace index along with its
 * workspace ID, or null if no index has been initialized.
 * Incremental sync operations target the first workspace until
 * multi-workspace support lands.
 *
 * @returns The first workspace's ID and MiniSearch index, or null.
 */
export function getFirstWorkspaceIndex(): {
  workspaceId: string;
  miniSearch: MiniSearch<SearchDocument>;
} | null {
  // Use the first initialized workspace
  const workspaceId = searchIndexes.keys().next().value;

  if (!workspaceId) {
    return null;
  }

  // Look up the workspace's index
  const miniSearch = searchIndexes.get(workspaceId);

  if (!miniSearch) {
    return null;
  }

  return { workspaceId, miniSearch };
}
