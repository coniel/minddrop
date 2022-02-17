import { DropConfigFilters, RegisteredDropConfig } from '../types';
import { useDropsStore } from '../useDropsStore';

/**
 * Returns registered drop type configs, optionally filtered by
 * drop types or extension IDs.
 *
 * @param filters Filters to filter the returned cofigs by.
 * @returns Registered drop type configs.
 */
export function getRegisteredDropTypes(
  filters?: DropConfigFilters,
): RegisteredDropConfig[] {
  let configs = useDropsStore.getState().registered;

  if (filters) {
    // Filter by extension ID
    if (filters.extension) {
      configs = configs.filter(({ extension }) =>
        filters.extension.includes(extension),
      );
    }

    // Filter by drop type
    if (filters.type) {
      configs = configs.filter(({ type }) => filters.type.includes(type));
    }
  }

  return configs;
}
