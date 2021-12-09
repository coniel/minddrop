import { DropFilters, DropMap } from '../types';
import { filterDrops } from '../filterDrops';
import { useDropsStore } from '../useDropsStore';

/**
 * Returns a `{ [id]: Drop }` map of drops matching the provided IDs.
 * Results can be filtered by passing in DropFilters.
 *
 * @param dropIds The IDs of the drops to retrieve.
 * @param filters Filters to filter to the drops.
 * @returns A `{ [id]: Drop }` map of the requested drops.
 */
export function useDrops(dropIds: string[], filters?: DropFilters): DropMap {
  const { drops } = useDropsStore();

  let requested = dropIds.reduce(
    (map, dropId) =>
      drops[dropId] ? { ...map, [dropId]: drops[dropId] } : map,
    {},
  );

  if (filters) {
    requested = filterDrops(requested, filters);
  }

  return requested;
}
