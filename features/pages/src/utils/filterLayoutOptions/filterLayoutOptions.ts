import { PageLayoutOption } from '../getPageLayoutOptions';

/**
 * Filters page layout options to those whose layout name contains
 * the query, case-insensitively.
 *
 * @param options - The page layout options to filter.
 * @param query - The search query.
 * @returns The matching page layout options.
 */
export function filterLayoutOptions(
  options: PageLayoutOption[],
  query: string,
): PageLayoutOption[] {
  // Normalize the query for case-insensitive matching
  const normalizedQuery = query.trim().toLowerCase();

  // Nothing to filter without a query
  if (!normalizedQuery) {
    return options;
  }

  // Keep options whose layout name contains the query
  return options.filter((option) =>
    option.layout.name.toLowerCase().includes(normalizedQuery),
  );
}
