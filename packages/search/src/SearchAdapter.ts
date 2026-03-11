import type { Database } from '@minddrop/databases';
import type { FullTextSearchResult, SearchEntryData } from './types';

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
   * Sends databases to the backend to initialize the search
   * index. The backend reads entries from disk.
   */
  searchInitialize(params: {
    workspaceId: string;
    databases: Database[];
  }): Promise<void>;

  /**
   * Incrementally syncs entry changes (upsert or delete)
   * to the backend search index.
   */
  searchSync(params: {
    workspaceId: string;
    action: 'upsert' | 'delete';
    entries?: SearchEntryData[];
    entryIds?: string[];
  }): Promise<void>;

  /**
   * Syncs database metadata changes (upsert or delete)
   * to the backend search index.
   */
  searchDatabaseSync(params: {
    workspaceId: string;
    action: 'upsert' | 'delete';
    database: { id: string; name: string; path: string; icon: string };
  }): Promise<void>;

  /**
   * Triggers a full re-index of all entries in a database.
   * Used after property schema changes (add/remove).
   */
  searchReindexDatabase(params: {
    workspaceId: string;
    databaseId: string;
  }): Promise<void>;

  /**
   * Renames a property column in the search index.
   * Used when a database property is renamed.
   */
  searchRenameProperty(params: {
    workspaceId: string;
    databaseId: string;
    oldName: string;
    newName: string;
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
