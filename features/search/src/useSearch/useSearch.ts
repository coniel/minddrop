import { useCallback, useRef, useState } from 'react';
import { type FullTextSearchResult, Search } from '@minddrop/search';
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
  // Sequence number of the most recently issued request, used to
  // drop results arriving out of order
  const requestRef = useRef(0);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FullTextSearchResult[]>([]);

  // Update the query and perform a full-text search
  const search = useCallback(async (value: string) => {
    setQuery(value);

    // Invalidate in-flight requests
    requestRef.current += 1;

    // Nothing to search for
    if (!value.trim()) {
      setResults([]);

      return;
    }

    // The request being issued below
    const requestId = requestRef.current;

    // Get the first workspace ID
    const workspaces = Workspaces.getAll();
    const workspaceId = Object.values(workspaces)[0]?.id;

    if (!workspaceId) {
      return;
    }

    try {
      const searchResults = await Search.fullText(workspaceId, value, 20);

      // Discard the results if a newer search was issued while this
      // one was in flight
      if (requestId !== requestRef.current) {
        return;
      }

      setResults(searchResults);
    } catch (error) {
      console.error('[search]', error);
    }
  }, []);

  // Clear the query and results
  const clear = useCallback(() => {
    setQuery('');
    setResults([]);

    // Invalidate in-flight requests so their results are discarded
    requestRef.current += 1;
  }, []);

  return { query, results, search, clear };
}
