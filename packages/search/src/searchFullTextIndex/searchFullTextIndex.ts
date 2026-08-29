import type { SearchResult } from 'minisearch';
import { searchIndexes } from '../searchIndexStore';
import type {
  FullTextMatchedProperty,
  FullTextSearchResult,
  StoredSearchFields,
} from '../types';
import { findMatchedProperties, highlightAllMatches } from '../utils';

/**
 * Performs a full-text fuzzy search across the workspace index.
 *
 * @param workspaceId - The workspace to search.
 * @param query - The search query string.
 * @param limit - Maximum number of results to return.
 * @param databaseId - Optional database ID to scope the search to.
 * @returns The matching entries and databases ranked by relevance.
 */
export function searchFullTextIndex(
  workspaceId: string,
  query: string,
  limit = 20,
  databaseId?: string,
): FullTextSearchResult[] {
  // No results without an initialized index
  const miniSearch = searchIndexes.get(workspaceId);

  if (!miniSearch) {
    return [];
  }

  // Search, optionally scoped to a single database
  const results = miniSearch.search(query, {
    filter: databaseId
      ? (result) => result.databaseId === databaseId
      : undefined,
  });

  // Lowercase query terms for substring matching
  const queryTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 0);

  return results.slice(0, limit).map((result) => {
    // MiniSearch types stored fields as `any`; narrow them to
    // the stored-fields shape declared in MINISEARCH_OPTIONS
    const stored = result as SearchResult & StoredSearchFields;
    const documentId: string = result.id;

    // Strip the `db:` document ID prefix from database results
    const entryId =
      stored.type === 'database' ? documentId.replace(/^db:/, '') : documentId;

    // Find matching properties for entry results
    let matchedProperties: FullTextMatchedProperty[] = [];

    if (stored.type === 'entry') {
      matchedProperties = findMatchedProperties(documentId, queryTerms);
    }

    // Add highlight markers to entry titles
    let title = stored.title;

    if (stored.type === 'entry') {
      title = highlightAllMatches(title, queryTerms);
    }

    return {
      id: entryId,
      type: stored.type,
      databaseId: stored.databaseId,
      databaseName: stored.databaseName,
      databaseIcon: stored.databaseIcon || '',
      title,
      score: result.score,
      matchedProperties,
    };
  });
}
