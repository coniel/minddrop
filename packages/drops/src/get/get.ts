import { getDrop } from '../getDrop';
import { getDrops } from '../getDrops';
import { Drop, DropFilters, DropMap } from '../types';

/**
 * Retrieves one or more drops by ID.
 *
 * If provided a single ID string, returns the drop.
 *
 * If provided an array of IDs, returns a `{ [id]: Drop }` map of the corresponding drops.
 * Drops can be filtered by passing in DropFilters. Filtering is not supported when getting a single drop.
 *
 * @param ids An array of drop IDs to retrieve.
 * @param filters Filters to filter to the drops by, only supported when getting multiple drops.
 * @returns The requested drop(s).
 */
export function get(dropId: string): Drop;
export function get(dropIds: string[], filters?: DropFilters): DropMap;
export function get(
  dropId: string | string[],
  filters?: DropFilters,
): Drop | DropMap {
  if (Array.isArray(dropId)) {
    return getDrops(dropId, filters);
  }

  if (filters) {
    throw new Error('Filtering is not supported when getting a single drop.');
  }

  return getDrop(dropId);
}
