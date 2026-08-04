import { itemReferenceAdapters } from '../itemReferenceAdapters';

/**
 * Unregisters the item reference adapter for the given entity type.
 *
 * @param type - The entity type of the adapter to unregister.
 */
export function unregisterItemReferenceAdapter(type: string): void {
  // Remove the adapter for the entity type
  itemReferenceAdapters.delete(type);
}
