import { debouncedPersist } from '../debouncedPersist';
import { discardIndexDocument } from '../discardIndexDocument';
import { searchIndexes } from '../searchIndexStore';

/**
 * Updates or adds a database document in the MiniSearch index.
 *
 * @param workspaceId - The workspace whose index to update.
 * @param database - The database to add or update in the index.
 */
export function upsertIndexDatabase(
  workspaceId: string,
  database: {
    id: string;
    name: string;
    icon?: string;
  },
): void {
  // Nothing to update without an initialized index
  const miniSearch = searchIndexes.get(workspaceId);

  if (!miniSearch) {
    return;
  }

  // Remove existing document if present
  const documentId = `db:${database.id}`;

  discardIndexDocument(miniSearch, documentId);

  // Re-add the document with the fresh metadata
  miniSearch.add({
    id: documentId,
    type: 'database',
    title: database.name,
    databaseId: database.id,
    databaseName: database.name,
    databaseIcon: database.icon || '',
    content: '',
    properties: '',
    tags: '',
  });

  debouncedPersist(workspaceId);
}
