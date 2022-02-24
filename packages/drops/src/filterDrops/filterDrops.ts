import { DropMap, DropFilters } from '../types';

/**
 * Filters drops by type, active, and deleted states.
 * If no filters are set, returns active drops.
 * If deleted filter is `true`, active drops are not
 * included unless specifically set to `true`.
 *
 * @param drops The drops to filter.
 * @param filters The filters by which to filter the drops.
 * @returns The filtered drops.
 */
export function filterDrops(drops: DropMap, filters: DropFilters): DropMap {
  // Active drops are included if `active = true` or if `deleted`
  // `deleted` filter is not set.
  const includeActive =
    filters.active !== false &&
    (filters.active === true || filters.deleted !== true);

  return Object.values(drops)
    .filter((drop) => {
      if (filters.type && !filters.type.includes(drop.type)) {
        return false;
      }
      if (includeActive && !drop.deleted) {
        return true;
      }

      if (filters.deleted && drop.deleted) {
        return true;
      }

      return false;
    })
    .reduce((map, drop) => ({ ...map, [drop.id]: drop }), {});
}
