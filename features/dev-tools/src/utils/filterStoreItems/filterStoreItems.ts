import { getStoreItemId } from '../getStoreItemId';
import { getStoreItemLabel } from '../getStoreItemLabel';

/**
 * Filters store items by their label, identifier, and contents.
 *
 * @param items - The store items to filter.
 * @param search - The text items must contain, matched case
 *   insensitively.
 * @returns The items matching the search text.
 */
export function filterStoreItems(
  items: Record<string, unknown>[],
  search: string,
): Record<string, unknown>[] {
  const query = search.trim().toLowerCase();

  // No search text means no filtering
  if (!query) {
    return items;
  }

  return items.filter((item) =>
    getSearchText(item).toLowerCase().includes(query),
  );
}

/**
 * Returns an item's label, identifier, and serialized contents as
 * a single string to match search text against.
 */
function getSearchText(item: Record<string, unknown>): string {
  return `${getStoreItemLabel(item)} ${getStoreItemId(item)} ${safeStringify(item)}`;
}

/**
 * Serializes an item, falling back to an empty string for items
 * which cannot be serialized.
 */
function safeStringify(item: Record<string, unknown>): string {
  try {
    return JSON.stringify(item) ?? '';
  } catch {
    return '';
  }
}
