import { ResourceDocument, ResourceStore } from '../types';

/**
 * Returns a resource document by ID or `null` if
 * the document does not exist.
 *
 * @param documentId - The ID of the document to retrieve.
 * @returns The requested document or `null`.
 */
export function useResourceDocument<
  TDocument extends ResourceDocument = ResourceDocument,
>(store: ResourceStore<TDocument>, documentId: string): TDocument | null {
  // Get the document from the store
  const document = store.useStore.getState().documents[documentId];

  // Return the document or null if it does not exist
  return document || null;
}
