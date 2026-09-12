import { Databases } from '@minddrop/databases';
import { debouncedPersist } from '../debouncedPersist';
import { discardIndexDocument } from '../discardIndexDocument';
import { searchIndexes } from '../searchIndexStore';
import { buildEntryDocument } from '../utils';

/**
 * Re-indexes all entries belonging to a database in the
 * MiniSearch index. Used when database metadata changes
 * (name, icon) or when the property schema changes.
 *
 * @param workspaceId - The workspace whose index to update.
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

  // Get all entries for this database from SQL
  const entries = Databases.sql
    .getAllEntries(workspaceId)
    .filter((entry) => entry.databaseId === databaseId);

  // Get fresh database metadata
  const database = {
    name: Databases.sql.getDatabaseName(databaseId, workspaceId) ?? '',
    icon: Databases.sql.getDatabaseIcon(databaseId, workspaceId),
  };

  // Remove and re-add each entry document
  for (const entry of entries) {
    discardIndexDocument(miniSearch, entry.id);

    miniSearch.add(buildEntryDocument(workspaceId, entry, database));
  }

  debouncedPersist(workspaceId);
}
