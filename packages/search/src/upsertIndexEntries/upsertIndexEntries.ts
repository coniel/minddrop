import { Databases } from '@minddrop/databases';
import { debouncedPersist } from '../debouncedPersist';
import { discardIndexDocument } from '../discardIndexDocument';
import { getFirstWorkspaceIndex } from '../getFirstWorkspaceIndex';
import { buildEntryDocument } from '../utils';

/**
 * Updates the MiniSearch index after entries are upserted.
 * Removes existing documents and re-adds them with fresh data.
 *
 * @param entries - The entries to add or update in the index.
 */
export function upsertIndexEntries(
  entries: {
    id: string;
    title: string;
    databaseId: string;
  }[],
): void {
  // Nothing to update without an initialized index
  const workspaceIndex = getFirstWorkspaceIndex();

  if (!workspaceIndex) {
    return;
  }

  const { workspaceId, miniSearch } = workspaceIndex;

  for (const entry of entries) {
    // Remove existing document if present
    discardIndexDocument(miniSearch, entry.id);

    // Re-add the document with fresh SQL data
    miniSearch.add(
      buildEntryDocument(entry, {
        name: Databases.sql.getDatabaseName(entry.databaseId) ?? '',
        icon: Databases.sql.getDatabaseIcon(entry.databaseId),
      }),
    );
  }

  // Debounced persist
  debouncedPersist(workspaceId);
}
