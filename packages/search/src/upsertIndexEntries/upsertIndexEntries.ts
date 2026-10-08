import { Databases } from '@minddrop/databases';
import { discardIndexDocument } from '../discardIndexDocument';
import { searchIndexes } from '../searchIndexStore';
import { buildEntryDocuments } from '../utils';

/**
 * Adds or updates entries in a workspace's MiniSearch index.
 *
 * @param workspaceId - The ID of the workspace whose index to update.
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

  // Build the entries' documents with fresh SQL data
  const documents = buildEntryDocuments(
    workspaceId,
    entries,
    Databases.sql.getEntryShortPropertyValues(
      { entryIds: entries.map((entry) => entry.id) },
      workspaceId,
    ),
  );

  for (const document of documents) {
    // Remove the existing document
    discardIndexDocument(miniSearch, document.id);

    // Re-add the document
    miniSearch.add(document);
  }
}
