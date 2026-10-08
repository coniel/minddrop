import { Databases } from '@minddrop/databases';
import { splitWords } from '@minddrop/utils';
import { MATCH_HIGHLIGHT_END, MATCH_HIGHLIGHT_START } from '../constants';
import type { FullTextMatchedProperty, FullTextSearchResult } from '../types';
import { highlightAllMatches } from '../utils';

export interface SearchContentOptions {
  /**
   * Maximum number of matching property values to return.
   * Defaults to 20.
   */
  limit?: number;

  /**
   * The ID of the database to limit the search to.
   */
  databaseId?: string;
}

/**
 * Back-end only. Searches the text and content property values
 * of a workspace's entries for every word of a query. Typos are
 * not matched.
 *
 * @param workspaceId - The ID of the workspace to search.
 * @param query - The search query string.
 * @param options - The result limit and database scope.
 * @returns The matching entries ranked by relevance, each with a snippet of every matching value.
 */
export function searchContent(
  workspaceId: string,
  query: string,
  options: SearchContentOptions = {},
): FullTextSearchResult[] {
  // Search the content index
  const matches = Databases.sql.searchEntryContent(
    query,
    {
      highlightStart: MATCH_HIGHLIGHT_START,
      highlightEnd: MATCH_HIGHLIGHT_END,
      limit: options.limit,
      databaseId: options.databaseId,
    },
    workspaceId,
  );

  // Resolve the lowercase query terms for highlighting titles
  const queryTerms = splitWords(query.toLowerCase());

  // Group the matches by entry, in rank order
  const results = new Map<string, FullTextSearchResult>();

  for (const match of matches) {
    // Convert the match into a matched property
    const matchedProperty: FullTextMatchedProperty = {
      name: match.propertyName,
      type: match.propertyType,
      value: match.snippet,
    };

    // Add further matches to the entry's existing result
    const existing = results.get(match.entryId);

    if (existing) {
      existing.matchedProperties.push(matchedProperty);
      continue;
    }

    // Create the entry's result
    results.set(match.entryId, {
      id: match.entryId,
      type: 'entry',
      databaseId: match.databaseId,
      databaseName: match.databaseName,
      databaseIcon: match.databaseIcon,
      title: highlightAllMatches(match.entryTitle, queryTerms),
      // Negate the BM25 rank so that higher scores are better
      score: -match.rank,
      matchedProperties: [matchedProperty],
    });
  }

  return [...results.values()];
}
