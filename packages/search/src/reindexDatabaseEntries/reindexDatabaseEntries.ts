import { Databases } from '@minddrop/databases';
import { discardIndexDocument } from '../discardIndexDocument';
import { searchIndexes } from '../searchIndexStore';
import { buildEntryDocuments } from '../utils';

/**
 * Re-indexes all entries belonging to a database in the
 * MiniSearch index.
 *
 * @param workspaceId - The ID of the workspace whose index to update.
 * @param databaseId - The ID of the database whose entries to re-index.
 */
export function reindexDatabaseEntries(
  workspaceId: string,
  databaseId: string,
): void {
  // Nothing to re-index without an initialized index
  const miniSearch = searchIndexes.get(workspaceId);

  if (!miniSearch) {
    return;
  }

  // Build the database's entry documents with fresh SQL data
  const documents = buildEntryDocuments(
    workspaceId,
    Databases.sql.getEntrySummaries({ databaseId }, workspaceId),
    Databases.sql.getEntryShortPropertyValues({ databaseId }, workspaceId),
  );

  for (const document of documents) {
    // Remove the existing document
    discardIndexDocument(miniSearch, document.id);

    // Re-add the document
    miniSearch.add(document);
  }
}
