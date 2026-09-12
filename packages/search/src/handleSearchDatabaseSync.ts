import { reindexDatabaseEntries } from './reindexDatabaseEntries';
import { removeIndexDatabase } from './removeIndexDatabase';
import { upsertIndexDatabase } from './upsertIndexDatabase';

/**
 * Back-end only. Handles syncing database metadata to the
 * MiniSearch index. On upsert, also re-indexes all entry
 * documents belonging to the database so their stored
 * databaseName/databaseIcon stay current. SQL sync is
 * handled by sql-databases.
 *
 * @param workspaceId - The workspace whose index to update.
 * @param action - Whether the database was upserted or deleted.
 * @param database - The database's metadata.
 */
export function handleSearchDatabaseSync({
  workspaceId,
  action,
  database,
}: {
  workspaceId: string;
  action: 'upsert' | 'delete';
  database: { id: string; name: string; path: string; icon: string };
}): void {
  if (action === 'upsert') {
    upsertIndexDatabase(workspaceId, database);

    // Re-index entry documents so databaseName/databaseIcon
    // are up to date.
    reindexDatabaseEntries(workspaceId, database.id);
  }

  if (action === 'delete') {
    removeIndexDatabase(workspaceId, database.id);
  }
}
