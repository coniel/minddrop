import { useCallback, useState } from 'react';
import type { FullTextSearchResult } from '@minddrop/search';
import { searchFullText } from '@minddrop/search';
import { Workspaces } from '@minddrop/workspaces';

export interface UseSearchResult {
  /**
   * The current search query.
   */
  query: string;

  /**
   * The current search results.
   */
  results: FullTextSearchResult[];

  /**
   * Updates the query and performs a full-text search.
   */
  search: (query: string) => void;

  /**
   * Clears the query and results.
   */
  clear: () => void;
}

/**
 * Hook that manages search query state and performs full-text
 * search against the active workspace.
 */
export function useSearch(): UseSearchResult {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FullTextSearchResult[]>([]);

  // Update the query and perform a full-text search
  const search = useCallback(async (value: string) => {
    setQuery(value);

    if (!value.trim()) {
      setResults([]);

      return;
    }

    // Get the first workspace ID
    const workspaces = Workspaces.getAll();
    const workspaceId = Object.values(workspaces)[0]?.id;

    if (!workspaceId) {
      return;
    }

    try {
      const searchResults = await searchFullText(workspaceId, value, 20);
      setResults(searchResults);
    } catch (error) {
      console.error('[search]', error);
    }
  }, []);

  // Clear the query and results
  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
  }, []);

  return { query, results, search, clear };
}
