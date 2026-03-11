import type { Database } from '@minddrop/databases';
import type { QueryPropertyFilter, QueryPropertySort } from '@minddrop/queries';
import type {
  FullTextSearchResult,
  SearchEntryData,
  StructuredSearchResult,
} from '@minddrop/search';
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
 * RPC handler for structured property-based queries via SQLite.
 */
export async function handleSearchStructured(params: {
  workspaceId: string;
  databaseId?: string;
  filters: QueryPropertyFilter[];
  sort: QueryPropertySort[];
  limit?: number;
  offset?: number;
}): Promise<StructuredSearchResult> {
  return Search.handleSearchStructured(params);
}

/**
 * RPC handler for incremental sync after entry changes.
 */
export async function handleSearchSync(params: {
  workspaceId: string;
  action: 'upsert' | 'delete';
  entries?: SearchEntryData[];
  entryIds?: string[];
}): Promise<void> {
  Search.handleSearchSync(params);
}

/**
 * RPC handler for syncing database metadata.
 */
export async function handleSearchDatabaseSync(params: {
  workspaceId: string;
  action: 'upsert' | 'delete';
  database: { id: string; name: string; path: string; icon: string };
}): Promise<void> {
  Search.handleSearchDatabaseSync(params);
}

/**
 * RPC handler for re-indexing all entries in a database.
 */
export async function handleSearchReindexDatabase(params: {
  workspaceId: string;
  databaseId: string;
}): Promise<void> {
  Search.handleSearchReindexDatabase(params);
}

/**
 * RPC handler for renaming a property across all entries.
 */
export async function handleSearchRenameProperty(params: {
  workspaceId: string;
  databaseId: string;
  oldName: string;
  newName: string;
}): Promise<void> {
  Search.handleSearchRenameProperty(params);
}
