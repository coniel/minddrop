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
