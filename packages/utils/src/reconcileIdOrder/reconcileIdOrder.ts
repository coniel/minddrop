/**
 * Orders items by an ordered ID list, reconciling the two: ordered
 * IDs without a matching item are ignored, and items missing from
 * the order are appended — sorted by the fallback comparator when
 * given, in item order otherwise.
 *
 * @param order - The ordered ID list to order the items by.
 * @param items - The items to order.
 * @param fallback - Comparator used to sort the appended items.
 * @returns The items in reconciled order.
 */
export function reconcileIdOrder<TItem extends { id: string }>(
  order: string[],
  items: TItem[],
  fallback?: (a: TItem, b: TItem) => number,
): TItem[] {
  const byId = new Map<string, TItem>(items.map((item) => [item.id, item]));

  // The items listed in the order, ignoring IDs without a match
  const ordered = order
    .map((id) => byId.get(id))
    .filter((item): item is TItem => !!item);
  const orderedIds = new Set(ordered.map((item) => item.id));

  // The items missing from the order
  const missing = items.filter((item) => !orderedIds.has(item.id));

  // Sort the missing items by the fallback comparator
  if (fallback) {
    missing.sort(fallback);
  }

  return [...ordered, ...missing];
}
