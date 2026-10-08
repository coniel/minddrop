import { discardIndexDocument } from '../discardIndexDocument';
import { searchIndexes } from '../searchIndexStore';
import { buildDatabaseDocument } from '../utils';

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

  // Remove the existing document if present
  discardIndexDocument(miniSearch, `db:${database.id}`);

  // Re-add the document with the fresh metadata
  miniSearch.add(buildDatabaseDocument(database));
}
