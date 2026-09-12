import { debouncedPersist } from '../debouncedPersist';
import { discardIndexDocument } from '../discardIndexDocument';
import { searchIndexes } from '../searchIndexStore';

/**
 * Removes a database document from the MiniSearch index.
 *
 * @param workspaceId - The workspace whose index to update.
 * @param databaseId - The ID of the database to remove.
 */
export function removeIndexDatabase(
  workspaceId: string,
  databaseId: string,
): void {
  // Nothing to remove without an initialized index
  const miniSearch = searchIndexes.get(workspaceId);

  if (!miniSearch) {
    return;
  }

  // Remove the database document
  discardIndexDocument(miniSearch, `db:${databaseId}`);

  debouncedPersist(workspaceId);
}
