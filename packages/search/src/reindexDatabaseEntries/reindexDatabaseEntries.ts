import { Databases } from '@minddrop/databases';
import { debouncedPersist } from '../debouncedPersist';
import { discardIndexDocument } from '../discardIndexDocument';
import { getFirstWorkspaceIndex } from '../getFirstWorkspaceIndex';
import { buildEntryDocument } from '../utils';

/**
 * Re-indexes all entries belonging to a database in the
 * MiniSearch index. Used when database metadata changes
 * (name, icon) or when the property schema changes.
 *
 * @param databaseId - The ID of the database whose entries to re-index.
 */
export function reindexDatabaseEntries(databaseId: string): void {
  // Nothing to re-index without an initialized index
  const workspaceIndex = getFirstWorkspaceIndex();

  if (!workspaceIndex) {
    return;
  }

  const { workspaceId, miniSearch } = workspaceIndex;

  // Get all entries for this database from SQL
  const entries = Databases.sql
    .getAllEntries()
    .filter((entry) => entry.databaseId === databaseId);

  // Get fresh database metadata
  const database = {
    name: Databases.sql.getDatabaseName(databaseId) ?? '',
    icon: Databases.sql.getDatabaseIcon(databaseId),
  };

  // Remove and re-add each entry document
  for (const entry of entries) {
    discardIndexDocument(miniSearch, entry.id);

    miniSearch.add(buildEntryDocument(entry, database));
  }

  debouncedPersist(workspaceId);
}
