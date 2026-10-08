import type { FullTextSearchResult } from './types';

export interface SearchAdapter {
  /**
   * Performs a full-text search. Optionally scoped to a single
   * database.
   */
  searchFullText(
    workspaceId: string,
    query: string,
    limit?: number,
    databaseId?: string,
  ): Promise<FullTextSearchResult[]>;

  /**
   * Builds the search index for a workspace from SQL.
   */
  searchInitialize(params: { workspaceId: string }): Promise<void>;

  /**
   * Drops a workspace's search index on the backend.
   */
  searchUnload(params: { workspaceId: string }): Promise<void>;

  /**
   * Incrementally syncs entry changes to the search
   * index on the backend.
   */
  searchSync(params: {
    workspaceId: string;
    action: 'upsert' | 'delete';
    entries?: { id: string; title: string; databaseId: string }[];
    entryIds?: string[];
  }): Promise<void>;

  /**
   * Syncs database metadata changes to the search
   * index on the backend.
   */
  searchDatabaseSync(params: {
    workspaceId: string;
    action: 'upsert' | 'delete';
    database: { id: string; name: string; path: string; icon: string };
  }): Promise<void>;

  /**
   * Triggers a re-index of all entries in a
   * database. Used after property schema changes.
   */
  searchReindexDatabase(params: {
    workspaceId: string;
    databaseId: string;
  }): Promise<void>;
}

let adapter: SearchAdapter | null = null;

/**
 * Registers a search adapter that handles search operations
 * via the platform's back-end (e.g. Bun RPC).
 */
export function registerSearchAdapter(searchAdapter: SearchAdapter): void {
  adapter = searchAdapter;
}

/**
 * Returns the registered search adapter.
 * Throws if no adapter has been registered.
 */
export function getSearchAdapter(): SearchAdapter {
  if (!adapter) {
    throw new Error('Search adapter not registered');
  }

  return adapter;
}
