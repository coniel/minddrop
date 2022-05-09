import { ResourceDocument, ResourceStore } from '../types';

/**
 * Returns a resource document by ID or `null` if
 * the document does not exist.
 */
export function useResourceDocument<
  TDocument extends ResourceDocument = ResourceDocument,
>(store: ResourceStore<TDocument>, documentId: string): TDocument | null {
  // Get the document from the store
  const document = store.get(documentId);

  // Return the document or null if it does not exist
  return document || null;
}
