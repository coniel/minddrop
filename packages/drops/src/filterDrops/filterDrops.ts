import { DropMap, DropFilters } from '../types';

/**
 * Filters drops by active, archived, and deleted state.
 * If no filters are set, returns active drops.
 * If either archived or deleted filters are `true`, active
 * drops are not included unless specifically set to `true`.
 *
 * @param drops The drops to filter.
 * @param filters The filters by which to filter the drops.
 * @returns The filtere drops.
 */
export function filterDrops(drops: DropMap, filters: DropFilters): DropMap {
  // Active drops are included if `active = true` or if `archived`
  // and `deleted` filters are not set.
  const includeActive =
    filters.active !== false &&
    (filters.active === true ||
      (filters.archived !== true && filters.deleted !== true));

  return Object.values(drops)
    .filter((drop) => {
      if (filters.type && !filters.type.includes(drop.type)) {
        return false;
      }
      if (includeActive && !drop.archived && !drop.deleted) {
        return true;
      }

      if (filters.archived && drop.archived) {
        return true;
      }

      if (filters.deleted && drop.deleted) {
        return true;
      }

      return false;
    })
    .reduce((map, drop) => ({ ...map, [drop.id]: drop }), {});
}
