import { PropertyFilter } from '../../types';
import { matchesPropertyFilter } from '../matchesPropertyFilter';
import { resolveFilterAdapter } from '../resolveFilterAdapter';

/**
 * Returns the items matching every filter. Items whose entity
 * type is not filterable fail the filter.
 *
 * @param items - The items to filter.
 * @param filters - The filters to match.
 * @param now - The reference date for relative date values, defaults to the current time.
 *
 * @returns The matching items, in their original order.
 */
export function filterItems<TItem extends { id: string }>(
  items: TItem[],
  filters: PropertyFilter[],
  now: Date = new Date(),
): TItem[] {
  // Nothing to filter by
  if (filters.length === 0) {
    return items;
  }

  // Match each item against every filter, reading its values
  // through its adapter. Items of entity types with no adapter
  // fail.
  return items.filter((item) => {
    const adapter = resolveFilterAdapter(item.id);

    if (!adapter) {
      return false;
    }

    return filters.every((filter) =>
      matchesPropertyFilter(adapter.resolveValue(item, filter), filter, now),
    );
  });
}
