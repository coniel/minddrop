import { getSearchAdapter } from '../SearchAdapter';
import type { FullTextSearchResult } from '../types';

/**
 * Performs a full-text fuzzy search across entries in the
 * given workspace. Optionally scoped to a single database.
 *
 * @param workspaceId - The workspace to search.
 * @param query - The search query string.
 * @param limit - Maximum number of results to return.
 * @param databaseId - Optional database ID to scope the search to.
 * @returns The matching entries ranked by relevance.
 */
export async function searchFullText(
  workspaceId: string,
  query: string,
  limit?: number,
  databaseId?: string,
): Promise<FullTextSearchResult[]> {
  const adapter = getSearchAdapter();

  return adapter.searchFullText(workspaceId, query, limit, databaseId);
}
