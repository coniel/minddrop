import { debouncedPersist } from '../debouncedPersist';
import { discardIndexDocument } from '../discardIndexDocument';
import { getFirstWorkspaceIndex } from '../getFirstWorkspaceIndex';

/**
 * Removes a database document from the MiniSearch index.
 *
 * @param databaseId - The ID of the database to remove.
 */
export function removeIndexDatabase(databaseId: string): void {
  // Nothing to remove without an initialized index
  const workspaceIndex = getFirstWorkspaceIndex();

  if (!workspaceIndex) {
    return;
  }

  const { workspaceId, miniSearch } = workspaceIndex;

  // Remove the database document
  discardIndexDocument(miniSearch, `db:${databaseId}`);

  debouncedPersist(workspaceId);
}
