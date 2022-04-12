import { ResourceConfig, ResourceDocument, ResourceStore } from '../types';

/**
 * Returns a `{ [id]: ResourceDocument }` map of all
 * resource documents.
 *
 * @param store The resource store.
 * @param config The resource config.
 * @returns The requested documenta.
 */
export function getAllResourceDocuments<TData>(
  store: ResourceStore<ResourceDocument<TData>>,
  config: ResourceConfig<TData>,
): Record<string, ResourceDocument<TData>> {
  // Get all resource documents from the store
  let documents = store.getAll();

  if (config.onGetAll) {
    // Call the config's `onGetAll` method which will return
    // possibly modidfied version of the documents.
    documents = config.onGetAll(documents);
  }

  // Return the documents
  return documents;
}
