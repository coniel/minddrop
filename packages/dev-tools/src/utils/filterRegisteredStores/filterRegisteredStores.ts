import { RegisteredStoreGroup } from '../../types';

/**
 * Filters store groups by search text, matched against the store
 * and namespace names.
 *
 * Groups whose namespace matches keep all of their stores, so that
 * searching for a namespace lists everything in it.
 *
 * @param groups - The store groups to filter.
 * @param search - The text stores must contain, matched case
 *   insensitively.
 * @returns The groups with at least one matching store.
 */
export function filterRegisteredStores(
  groups: RegisteredStoreGroup[],
  search: string,
): RegisteredStoreGroup[] {
  const query = search.trim().toLowerCase();

  // No search text means no filtering
  if (!query) {
    return groups;
  }

  return groups
    .map((group) => {
      if (group.namespace.toLowerCase().includes(query)) {
        return group;
      }

      return {
        ...group,
        stores: group.stores.filter((store) =>
          store.name.toLowerCase().includes(query),
        ),
      };
    })
    .filter((group) => group.stores.length > 0);
}
