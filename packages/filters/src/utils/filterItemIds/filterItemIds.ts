import { PropertyFilter } from '../../types';
import { matchesPropertyFilter } from '../matchesPropertyFilter';
import { resolveFilterAdapter } from '../resolveFilterAdapter';

/**
 * Returns the IDs whose items match every filter. IDs of an entity
 * type which is not filterable, or of items which do not exist,
 * fail the filter.
 *
 * @param ids - The IDs to filter.
 * @param filters - The filters to match.
 * @param now - The reference date for relative date values, defaults to the current time.
 *
 * @returns The matching IDs, in their original order.
 */
export function filterItemIds(
  ids: string[],
  filters: PropertyFilter[],
  now: Date = new Date(),
): string[] {
  // Nothing to filter by
  if (filters.length === 0) {
    return ids;
  }

  // Match each ID's item against every filter, reading its values
  // through its adapter. IDs of entity types with no adapter, and
  // of missing items, fail.
  return ids.filter((id) => {
    const adapter = resolveFilterAdapter(id);

    if (!adapter) {
      return false;
    }

    const item = adapter.get(id);

    if (!item) {
      return false;
    }

    return filters.every((filter) =>
      matchesPropertyFilter(adapter.resolveValue(item, filter), filter, now),
    );
  });
}
