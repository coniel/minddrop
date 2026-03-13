import { initializeSearchData } from './initializeSearchData';
import {
  reindexDatabaseEntries,
  removeIndexDatabase,
  removeIndexEntries,
  searchFullTextIndex,
  upsertIndexDatabase,
  upsertIndexEntries,
} from './searchIndex';
import type { FullTextSearchResult } from './types';

/**
 * Back-end only. Initializes MiniSearch for a workspace.
 * After loading or rebuilding the index, applies any
 * incremental entry changes from SQL initialization.
 */
export async function handleSearchInitialize({
  workspaceId,
  schemaChanged,
  changedEntries,
  deletedEntryIds,
}: {
  workspaceId: string;
  schemaChanged: boolean;
  changedEntries: { id: string; title: string; databaseId: string }[];
  deletedEntryIds: string[];
}): Promise<void> {
  await initializeSearchData(workspaceId, schemaChanged);

  // If the schema changed, the index was fully rebuilt from
  // SQL data so incremental sync is unnecessary
  if (schemaChanged) {
    return;
  }

  // Apply incremental entry changes that occurred while
  // the app was not running
  if (changedEntries.length > 0) {
    upsertIndexEntries(changedEntries);
  }

  if (deletedEntryIds.length > 0) {
    removeIndexEntries(deletedEntryIds);
  }
}

/**
 * Back-end only. Performs a full-text fuzzy search via
 * MiniSearch.
 */
export function handleSearchFullText({
  workspaceId,
  query,
  limit,
  databaseId,
}: {
  workspaceId: string;
  query: string;
  limit?: number;
  databaseId?: string;
}): FullTextSearchResult[] {
  return searchFullTextIndex(workspaceId, query, limit, databaseId);
}

/**
 * Back-end only. Handles incremental sync after entry
 * changes. Updates the MiniSearch index only; SQL sync
 * is handled by sql-databases.
 */
export function handleSearchSync({
  action,
  entries,
  entryIds,
}: {
  workspaceId: string;
  action: 'upsert' | 'delete';
  entries?: { id: string; title: string; databaseId: string }[];
  entryIds?: string[];
}): void {
  if (action === 'upsert' && entries?.length) {
    upsertIndexEntries(entries);
  }

  if (action === 'delete' && entryIds?.length) {
    removeIndexEntries(entryIds);
  }
}

/**
 * Back-end only. Handles syncing database metadata to the
 * MiniSearch index. On upsert, also re-indexes all entry
 * documents belonging to the database so their stored
 * databaseName/databaseIcon stay current. SQL sync is
 * handled by sql-databases.
 */
export function handleSearchDatabaseSync({
  action,
  database,
}: {
  workspaceId: string;
  action: 'upsert' | 'delete';
  database: { id: string; name: string; path: string; icon: string };
}): void {
  if (action === 'upsert') {
    upsertIndexDatabase(database);

    // Re-index entry documents so databaseName/databaseIcon
    // are up to date
    reindexDatabaseEntries(database.id);
  }

  if (action === 'delete') {
    removeIndexDatabase(database.id);
  }
}

/**
 * Back-end only. Re-indexes all entries in a database in
 * the MiniSearch index. Used when the property schema
 * changes (add/remove/rename). SQL sync is handled by
 * sql-databases.
 */
export function handleSearchReindexDatabase({
  databaseId,
}: {
  workspaceId: string;
  databaseId: string;
}): void {
  reindexDatabaseEntries(databaseId);
}
