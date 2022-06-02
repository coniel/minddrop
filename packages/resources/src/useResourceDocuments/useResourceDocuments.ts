import { filterResourceDocuments } from '../filterResourceDocuments';
import {
  ResourceDocument,
  ResourceStore,
  ResourceDocumentMap,
  ResourceDocumentFilters,
} from '../types';

/**
 * Returns a `{ [id]: ResourceDocument }` map of resource
 * documents by ID.
 *
 * @param store - The resource documents store.
 * @param documentIds - The IDs of the documents to retrieve.
 * @param filters - Optional filters by which to filter the returned docuemnts.
 * @returns A `{ [id]: ResourceDocument }` map of the requested documents.
 */
export function useResourceDocuments<
  TDocument extends ResourceDocument = ResourceDocument,
>(
  store: ResourceStore<TDocument>,
  documentIds: string[],
  filters?: ResourceDocumentFilters,
): ResourceDocumentMap<TDocument> {
  // Get all documents from the store
  const { documents } = store.useStore();

  // Get the requested documents
  let requested = documentIds.reduce(
    (map, id) => (documents[id] ? { ...map, [id]: documents[id] } : map),
    {},
  );

  if (filters) {
    // If filters were provided, filter the documents
    requested = filterResourceDocuments(requested, filters);
  }

  // Return the requested documents
  return requested;
}
