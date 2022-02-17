import { DropFilters, DropMap } from '../types';
import { useDropsStore } from '../useDropsStore';
import { DropNotFoundError } from '../errors';
import { filterDrops } from '../filterDrops';

/**
 * Retrieves drops by ID from the drops store.
 * Drops can be filtered by passing in DropFilters.
 *
 * @param ids An array of drop IDs to retrieve.
 * @param filters Filters to filter to the drops by.
 * @returns A `{ [id]: Drop }` map of the requested drops.
 */
export function getDrops(ids: string[], filters?: DropFilters): DropMap {
  const { drops } = useDropsStore.getState();
  let requested = ids.reduce(
    (map, id) => (drops[id] ? { ...map, [id]: drops[id] } : map),
    {},
  );

  if (Object.keys(requested).length !== ids.length) {
    const missingIds = ids.filter((id) => !Object.keys(requested).includes(id));
    throw new DropNotFoundError(missingIds);
  }

  if (filters) {
    requested = filterDrops(requested, filters);
  }

  return requested;
}
