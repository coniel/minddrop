import { FilterAdaptersRegistry } from './FilterAdaptersRegistry';
import { FilterAdapter } from './types';

/**
 * Registers a filter adapter for an entity type, replacing any
 * adapter registered under the same type.
 *
 * @param adapter - The adapter to register.
 */
export function registerFilterAdapter<TItem extends { id: string }>(
  adapter: FilterAdapter<TItem>,
): void {
  // Register the adapter
  FilterAdaptersRegistry.register(adapter as FilterAdapter);
}
