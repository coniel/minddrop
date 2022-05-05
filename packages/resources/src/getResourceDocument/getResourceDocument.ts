import { ResourceDocumentNotFoundError } from '../errors';
import {
  ResourceConfig,
  ResourceDocument,
  RDData,
  ResourceStore,
} from '../types';

/**
 * Returns a resource document by ID.
 *
 * @param store - The resource store.
 * @param config - The resource config.
 * @param documentId - The ID of the document to retrieve.
 * @param skipOnGet - When `true`, does not call the config's `onGet` callback.
 * @returns The requested document.
 *
 * @throws ResourceDocumentNotFoundError
 * Thrown if the document does not exist.
 */
export function getResourceDocument<
  TData extends RDData,
  TResourceDocument extends ResourceDocument<TData> = ResourceDocument<TData>,
>(
  store: ResourceStore<TResourceDocument>,
  config: ResourceConfig<TData, TResourceDocument>,
  documentId: string,
  skipOnGet?: boolean,
): TResourceDocument {
  // Get the document from the store
  let document = store.get(documentId);

  if (!document) {
    // Throw a `ResourceNotFoundError` if the document does not exist
    throw new ResourceDocumentNotFoundError(config.resource, documentId);
  }

  if (config.onGet && !skipOnGet) {
    // Call the config's `onGet` method which will return
    // a possibly modidfied version of the document.
    document = config.onGet(document);
  }

  // Return the document
  return document;
}
