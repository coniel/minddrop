import { Databases } from '@minddrop/databases';
import { debouncedPersist } from '../debouncedPersist';
import { discardIndexDocument } from '../discardIndexDocument';
import { searchIndexes } from '../searchIndexStore';
import { buildEntryDocument } from '../utils';

/**
 * Updates the MiniSearch index after entries are upserted.
 * Removes existing documents and re-adds them with fresh data.
 *
 * @param workspaceId - The workspace whose index to update.
 * @param entries - The entries to add or update in the index.
 */
export function upsertIndexEntries(
  workspaceId: string,
  entries: {
    id: string;
    title: string;
    databaseId: string;
  }[],
): void {
  // Nothing to update without an initialized index
  const miniSearch = searchIndexes.get(workspaceId);

  if (!miniSearch) {
    return;
  }

  for (const entry of entries) {
    // Remove existing document if present
    discardIndexDocument(miniSearch, entry.id);

    // Re-add the document with fresh SQL data
    miniSearch.add(
      buildEntryDocument(workspaceId, entry, {
        name:
          Databases.sql.getDatabaseName(entry.databaseId, workspaceId) ?? '',
        icon: Databases.sql.getDatabaseIcon(entry.databaseId, workspaceId),
      }),
    );
  }

  // Debounced persist
  debouncedPersist(workspaceId);
}
