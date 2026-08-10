import { fuzzySearch } from '@minddrop/utils';
import { QueriesStore } from '../../QueriesStore';
import { Query } from '../../types';

/**
 * Performs a fuzzy search on query names.
 *
 * @param searchText - The search text.
 * @returns The matched queries ranked by match quality.
 */
export function searchQueries(searchText: string): Query[] {
  const allQueries = QueriesStore.getAllArray();

  // Map each name to its queries. Names can collide so each
  // maps to a list.
  const queriesByName = new Map<string, Query[]>();

  allQueries.forEach((query) => {
    const nameQueries = queriesByName.get(query.name) ?? [];

    nameQueries.push(query);
    queriesByName.set(query.name, nameQueries);
  });

  // Fuzzy match against the query names
  const matchedNames = fuzzySearch(
    allQueries.map((query) => query.name),
    searchText,
  );

  // Collect matched queries in rank order
  const matched: Query[] = [];

  matchedNames.forEach((name) => {
    queriesByName.get(name)?.forEach((query) => {
      // Skip queries already matched via a duplicate name
      if (!matched.includes(query)) {
        matched.push(query);
      }
    });
  });

  return matched;
}
