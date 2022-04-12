import { ResourceDocumentNotFoundError } from '../errors';
import { ResourceConfig, ResourceDocument, ResourceStore } from '../types';

/**
 * Returns a `{ [id]: ResourceDocument }` map of resource
 * documents by ID.
 *
 * - Throws a `ResourceDocumentNotFoundError` if the
 *   any of the requested documents do not exist.
 *
 * @param store The resource store.
 * @param config The resource config.
 * @param documentIda The IDs of the documenta to retrieve.
 * @returns The requested documenta.
 */
export function getResourceDocuments<TData>(
  store: ResourceStore<ResourceDocument<TData>>,
  config: ResourceConfig<TData>,
  documentIds: string[],
): Record<string, ResourceDocument<TData>> {
  // Get the documents from the store
  let documents = store.get(documentIds);

  // Check if any of the requested documents do not exist
  const missingDocumentIds = documentIds.filter((id) => !documents[id]);

  if (missingDocumentIds.length) {
    // Throw a `ResourceNotFoundError` if any of the requested
    // documents do not exist, providing the missing document IDs.
    throw new ResourceDocumentNotFoundError(
      config.resource,
      missingDocumentIds,
    );
  }

  if (config.onGetMany) {
    // Call the config's `onGetMany` method which will return
    // possibly modidfied version of the documents.
    documents = config.onGetMany(documents);
  }

  // Return the documents
  return documents;
}
