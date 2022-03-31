import { Drop, DropConfigFilters, RegisteredDropConfig } from '../types';
import { useDropsStore } from '../useDropsStore';

/**
 * Returns registered drop type configs, optionally filtered by
 * drop types or extension IDs.
 *
 * @param filters Filters to filter the returned cofigs by.
 * @returns Registered drop type configs.
 */
export function getRegisteredDropTypes<TDrop extends Drop = Drop>(
  filters?: DropConfigFilters,
): RegisteredDropConfig<TDrop>[] {
  let configs = useDropsStore.getState()
    .registered as RegisteredDropConfig<TDrop>[];

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
