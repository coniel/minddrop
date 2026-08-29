import { debouncedPersist } from '../debouncedPersist';
import { discardIndexDocument } from '../discardIndexDocument';
import { getFirstWorkspaceIndex } from '../getFirstWorkspaceIndex';

/**
 * Removes entries from the MiniSearch index.
 *
 * @param entryIds - The IDs of the entries to remove.
 */
export function removeIndexEntries(entryIds: string[]): void {
  // Nothing to remove without an initialized index
  const workspaceIndex = getFirstWorkspaceIndex();

  if (!workspaceIndex) {
    return;
  }

  const { workspaceId, miniSearch } = workspaceIndex;

  // Remove each entry document
  for (const id of entryIds) {
    discardIndexDocument(miniSearch, id);
  }

  // Debounced persist
  debouncedPersist(workspaceId);
}
