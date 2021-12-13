import { DropFilters, DropMap } from '../types';
import { useDropsStore } from '../useDropsStore';
import { filterDrops } from '../filterDrops';

/**
 * Retrieves all drops from the drops store as a `{ [id]: Drop }` map.
 * Drops can be filtered by passing in DropFilters.
 *
 * @param filters Filters to filter to the drops by.
 * @returns A `{ [id]: Drop }` map.
 */
export function getAllDrops(filters?: DropFilters): DropMap {
  const { drops } = useDropsStore.getState();

  if (filters) {
    return filterDrops(drops, filters);
  }

  return drops;
}
