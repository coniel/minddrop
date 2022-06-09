import { ResourceConfig, ResourceDocument, ResourceStore } from '../types';

/**
 * Clears all documents from the resource store.
 *
 * @param store The resource store.
 * @param config The resource config.
 */
export function clearResourceDocuments<TData>(
  store: ResourceStore<ResourceDocument<TData>>,
  config: ResourceConfig<TData>,
): void {
  // Clear the store
  store.clear();

  if (config.onClear) {
    // Call the config's `onClear` callback
    config.onClear();
  }
}
