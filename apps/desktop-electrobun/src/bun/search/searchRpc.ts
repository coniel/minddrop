import type { Database } from '@minddrop/databases';
import type { FullTextSearchResult } from '@minddrop/search';
import { Search } from '@minddrop/search';

/**
 * RPC handler for initializing search data from the frontend.
 * Receives databases; entries are read from disk.
 */
export async function handleSearchInitialize(params: {
  workspaceId: string;
  databases: Database[];
}): Promise<void> {
  await Search.handleSearchInitialize(params);
}

/**
 * RPC handler for full-text fuzzy search via MiniSearch.
 */
export async function handleSearchFullText(params: {
  workspaceId: string;
  query: string;
  limit?: number;
  databaseId?: string;
}): Promise<FullTextSearchResult[]> {
  return Search.handleSearchFullText(params);
}

/**
 * RPC handler for incremental MiniSearch sync after entry
 * changes. SQL sync is handled by the databases package.
 */
export async function handleSearchSync(params: {
  workspaceId: string;
  action: 'upsert' | 'delete';
  entries?: { id: string; title: string; databaseId: string }[];
  entryIds?: string[];
}): Promise<void> {
  Search.handleSearchSync(params);
}

/**
 * RPC handler for syncing database metadata to MiniSearch.
 * SQL sync is handled by the databases package.
 */
export async function handleSearchDatabaseSync(params: {
  workspaceId: string;
  action: 'upsert' | 'delete';
  database: { id: string; name: string; path: string; icon: string };
}): Promise<void> {
  Search.handleSearchDatabaseSync(params);
}

/**
 * RPC handler for re-indexing all entries in a database
 * in the MiniSearch index.
 */
export async function handleSearchReindexDatabase(params: {
  workspaceId: string;
  databaseId: string;
}): Promise<void> {
  Search.handleSearchReindexDatabase(params);
}
