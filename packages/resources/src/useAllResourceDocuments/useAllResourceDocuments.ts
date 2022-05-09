import { filterResourceDocuments } from '../filterResourceDocuments';
import {
  ResourceDocumentFilters,
  ResourceDocument,
  ResourceStore,
  ResourceDocumentMap,
} from '../types';

/**
 * Returns a `{ [id]: ResourceDocument }` map of all resource
 * documents.
 *
 * @param store - The resource documents store.
 * @param filters - Optional filters by which to filter the returned documents.
 * @returns A `{ [id]: ResourceDocument }` map of all documents.
 */
export function useAllResourceDocuments<
  TDocument extends ResourceDocument = ResourceDocument,
>(
  store: ResourceStore<TDocument>,
  filters?: ResourceDocumentFilters,
): ResourceDocumentMap<TDocument> {
  // Get all resource documents
  let { documents } = store.useStore.getState();

  if (filters) {
    // Filter the documents if filters were provided
    documents = filterResourceDocuments(documents, filters);
  }

  // Return the documents
  return documents;
}
