import { itemReferenceAdapters } from '../itemReferenceAdapters';
import { ItemReferenceAdapter } from '../types';

/**
 * Registers an item reference adapter for its entity type,
 * replacing any previously registered adapter for the same type.
 *
 * @param adapter - The adapter to register.
 */
export function registerItemReferenceAdapter(
  adapter: ItemReferenceAdapter,
): void {
  // Store the adapter under its entity type
  itemReferenceAdapters.set(adapter.type, adapter);
}
