import type { FullTextSearchResult } from './types';

export interface SearchAdapter {
  /**
   * Performs a full-text fuzzy search. Optionally scoped
   * to a single database.
   */
  searchFullText(
    workspaceId: string,
    query: string,
    limit?: number,
    databaseId?: string,
  ): Promise<FullTextSearchResult[]>;

  /**
   * Initializes the MiniSearch index for a workspace.
   * Forces a full rebuild if the SQL schema changed,
   * otherwise applies incremental updates.
   */
  searchInitialize(params: {
    workspaceId: string;
    schemaChanged: boolean;
    changedEntries: { id: string; title: string; databaseId: string }[];
    deletedEntryIds: string[];
  }): Promise<void>;

  /**
   * Incrementally syncs entry changes to the MiniSearch
   * index on the backend.
   */
  searchSync(params: {
    workspaceId: string;
    action: 'upsert' | 'delete';
    entries?: { id: string; title: string; databaseId: string }[];
    entryIds?: string[];
  }): Promise<void>;

  /**
   * Syncs database metadata changes to the MiniSearch
   * index on the backend.
   */
  searchDatabaseSync(params: {
    workspaceId: string;
    action: 'upsert' | 'delete';
    database: { id: string; name: string; path: string; icon: string };
  }): Promise<void>;

  /**
   * Triggers a MiniSearch re-index of all entries in a
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
