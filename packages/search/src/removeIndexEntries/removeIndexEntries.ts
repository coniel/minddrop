import { debouncedPersist } from '../debouncedPersist';
import { discardIndexDocument } from '../discardIndexDocument';
import { searchIndexes } from '../searchIndexStore';

/**
 * Removes entries from the MiniSearch index.
 *
 * @param workspaceId - The workspace whose index to update.
 * @param entryIds - The IDs of the entries to remove.
 */
export function removeIndexEntries(
  workspaceId: string,
  entryIds: string[],
): void {
  // Nothing to remove without an initialized index
  const miniSearch = searchIndexes.get(workspaceId);

  if (!miniSearch) {
    return;
  }

  // Remove each entry document
  for (const id of entryIds) {
    discardIndexDocument(miniSearch, id);
  }

  // Debounced persist
  debouncedPersist(workspaceId);
}
