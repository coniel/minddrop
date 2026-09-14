import { FilterAdaptersRegistry } from './FilterAdaptersRegistry';

/**
 * Unregisters the filter adapter of an entity type. Does nothing
 * when none is registered.
 *
 * @param type - The entity type to unregister the adapter of.
 */
export function unregisterFilterAdapter(type: string): void {
  // Unregister the adapter
  FilterAdaptersRegistry.unregister(type);
}
