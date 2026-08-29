import { reindexDatabaseEntries } from './reindexDatabaseEntries';

/**
 * Back-end only. Re-indexes all entries in a database in
 * the MiniSearch index. Used when the property schema
 * changes (add/remove/rename). SQL sync is handled by
 * sql-databases.
 *
 * @param databaseId - The ID of the database whose entries to re-index.
 */
export function handleSearchReindexDatabase({
  databaseId,
}: {
  workspaceId: string;
  databaseId: string;
}): void {
  reindexDatabaseEntries(databaseId);
}
