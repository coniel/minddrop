import { DropFilters, DropMap } from '../types';
import { filterDrops } from '../filterDrops';
import { useDropsStore } from '../useDropsStore';

/**
 * Returns a `{ [id]: Drop }` map of all drops.
 * Results can be filtered by passing in DropFilters.
 * By default, only active drops are returned.
 *
 * @param filters Filters to filter to the drops.
 * @returns A `{ [id]: Drop }` map of all drops.
 */
export function useAllDrops(filters?: DropFilters): DropMap {
  const { drops } = useDropsStore();

  if (filters) {
    return filterDrops(drops, filters);
  }

  return drops;
}
