import { searchFullTextIndex } from './searchFullTextIndex';
import type { FullTextSearchResult } from './types';

/**
 * Back-end only. Performs a full-text fuzzy search via
 * MiniSearch.
 *
 * @param workspaceId - The workspace to search.
 * @param query - The search query string.
 * @param limit - Maximum number of results to return.
 * @param databaseId - Optional database ID to scope the search to.
 * @returns The matching results ranked by relevance.
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
