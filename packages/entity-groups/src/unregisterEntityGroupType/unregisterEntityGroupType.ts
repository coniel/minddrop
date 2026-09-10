import { EntityGroupTypesRegistry } from '../EntityGroupTypesRegistry';
import { EntityGroupsStore } from '../EntityGroupsStore';

/**
 * Unregisters a group type, dropping its groups from the store.
 *
 * @param type - The group type to unregister.
 */
export function unregisterEntityGroupType(type: string): void {
  // Drop the type's config
  EntityGroupTypesRegistry.unregister(type);

  // Drop the groups registered under the type, which nothing can
  // read or write once the type is gone.
  EntityGroupsStore.remove(type);
}
