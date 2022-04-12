import { ResourceDocumentNotFoundError } from '../errors';
import { ResourceConfig, ResourceDocument, ResourceStore } from '../types';

/**
 * Returns a resource document by ID.
 *
 * - Throws a `ResourceDocumentNotFoundError` if the
 *   document does not exist.
 *
 * @param store The resource store.
 * @param config The resource config.
 * @param documentId The ID of the document to retrieve.
 * @returns The requested document.
 */
export function getResourceDocument<TData>(
  store: ResourceStore<ResourceDocument<TData>>,
  config: ResourceConfig<TData>,
  documentId: string,
): ResourceDocument<TData> {
  // Get the document from the store
  let document = store.get(documentId);

  if (!document) {
    // Throw a `ResourceNotFoundError` if the document does not exist
    throw new ResourceDocumentNotFoundError(config.resource, documentId);
  }

  if (config.onGet) {
    // Call the config's `onGet` method which will return
    // a possibly modidfied version of the document.
    document = config.onGet(document);
  }

  // Return the document
  return document;
}
