import { fuzzySearch } from '../fuzzySearch';

/**
 * Performs a fuzzy search on a list of items by one of their string
 * fields, e.g. their name.
 *
 * @param items - The items to search through.
 * @param query - The search query.
 * @param getValue - Returns the value, or values, of an item to match against.
 * @returns The matched items ranked by match quality.
 */
export function fuzzySearchBy<TItem>(
  items: TItem[],
  query: string,
  getValue: (item: TItem) => string | string[],
): TItem[] {
  // Map each value to its items. A value can belong to multiple items
  // so each maps to a list.
  const itemsByValue = new Map<string, TItem[]>();
  const values: string[] = [];

  items.forEach((item) => {
    const itemValues = getValue(item);

    (Array.isArray(itemValues) ? itemValues : [itemValues]).forEach((value) => {
      const valueItems = itemsByValue.get(value) ?? [];

      valueItems.push(item);
      itemsByValue.set(value, valueItems);
      values.push(value);
    });
  });

  // Fuzzy match against the values
  const matchedValues = fuzzySearch(values, query);

  // Collect the matched items in rank order, skipping items already
  // matched via a duplicate value.
  const matched = new Set<TItem>();

  matchedValues.forEach((value) => {
    itemsByValue.get(value)?.forEach((item) => matched.add(item));
  });

  return Array.from(matched);
}
