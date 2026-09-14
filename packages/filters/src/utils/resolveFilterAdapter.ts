import { entityIdType } from '@minddrop/utils';
import { FilterAdaptersRegistry } from '../FilterAdaptersRegistry';
import { FilterAdapter } from '../types';

/**
 * Returns the filter adapter registered for an ID's entity type,
 * or null when its type has none.
 *
 * @param id - The item ID.
 * @returns The item's filter adapter.
 */
export function resolveFilterAdapter(id: string): FilterAdapter | null {
  // Read the entity type off the ID
  const type = entityIdType(id);

  // IDs without a type prefix have no adapter
  if (!type) {
    return null;
  }

  // Look up the type's adapter
  return FilterAdaptersRegistry.get(type, false);
}
