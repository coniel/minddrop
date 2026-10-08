import type { SearchResult } from 'minisearch';
import { splitWords } from '@minddrop/utils';
import { searchContent } from '../searchContent';
import { searchIndexes } from '../searchIndexStore';
import type {
  FullTextMatchedProperty,
  FullTextSearchResult,
  StoredSearchFields,
} from '../types';
import { findMatchedProperties, highlightAllMatches } from '../utils';

/**
 * Performs a full-text search across the workspace. Titles,
 * short property values and tags match fuzzily. Text and
 * content property values match by word prefix and are listed
 * below the other matches.
 *
 * Title matches always rank above matches in other fields:
 * summed multi-field scores would otherwise let an entry with
 * the query in several property values outrank an entry whose
 * title is the match.
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

  // Optionally scope the search to a single database
  const filter = databaseId
    ? (result: SearchResult) => result.databaseId === databaseId
    : undefined;

  // Rank title matches by title relevance alone so that
  // matches in other fields cannot inflate their position.
  const titleResults = miniSearch.search(query, {
    fields: ['title'],
    filter,
  });

  // Full search across all fields for the remaining matches
  const fullResults = miniSearch.search(query, { filter });

  // Append the non-title matches below the title matches
  const titleResultIds = new Set<string>(
    titleResults.map((result) => result.id),
  );
  const results = [
    ...titleResults,
    ...fullResults.filter((result) => !titleResultIds.has(result.id)),
  ];

  // Lowercase query terms for substring matching
  const queryTerms = splitWords(query.toLowerCase());

  // Build the results of the search index matches
  const nameResults = results
    .slice(0, limit)
    .map((result): FullTextSearchResult => {
      // Narrow the stored fields to the shape declared in
      // MINISEARCH_OPTIONS. MiniSearch types them as `any`.
      const stored = result as SearchResult & StoredSearchFields;
      // Read the document ID
      const documentId: string = result.id;

      // Strip the `db:` document ID prefix from database results
      const entryId =
        stored.type === 'database'
          ? documentId.replace(/^db:/, '')
          : documentId;

      // Find matching properties for entry results
      let matchedProperties: FullTextMatchedProperty[] = [];

      if (stored.type === 'entry') {
        matchedProperties = findMatchedProperties(
          workspaceId,
          documentId,
          queryTerms,
        );
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

  // Skip the content search when the name matches fill the limit
  if (nameResults.length >= limit) {
    return nameResults;
  }

  // Search the content, leaving out entries already in the name
  // results.
  const nameResultIds = new Set(nameResults.map((result) => result.id));
  const contentResults = searchContent(workspaceId, query, {
    limit,
    databaseId,
  }).filter((result) => !nameResultIds.has(result.id));

  // Append the content results below the name results, within the
  // limit.
  return [...nameResults, ...contentResults].slice(0, limit);
}
