import { PropertyValue } from '@minddrop/properties';
import { PropertyFilter } from '../../types';
import { matchesPropertyFilter } from '../matchesPropertyFilter';

/**
 * Returns the items matching every filter.
 *
 * @param items - The items to filter.
 * @param filters - The filters to match.
 * @param resolveValue - Returns an item's value for a filter's property.
 * @param now - The reference date for relative date values, defaults to the current time.
 *
 * @returns The matching items.
 */
export function applyPropertyFilters<TItem>(
  items: TItem[],
  filters: PropertyFilter[],
  resolveValue: (
    item: TItem,
    filter: PropertyFilter,
  ) => PropertyValue | undefined,
  now: Date = new Date(),
): TItem[] {
  // Nothing to filter by
  if (filters.length === 0) {
    return items;
  }

  // Keep the items matching every filter
  return items.filter((item) =>
    filters.every((filter) =>
      matchesPropertyFilter(resolveValue(item, filter), filter, now),
    ),
  );
}
