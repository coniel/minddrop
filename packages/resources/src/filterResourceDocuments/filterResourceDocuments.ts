import {
  ResourceDocument,
  ResourceDocumentMap,
  ResourceDocumentFilters,
} from '../types';

/**
 * Filters are resource document map according the
 * the provided filters.
 *
 * Filtering operates in one of two modes:
 * - Exclusive filtering: setting filter values to `false`
 *   will remove the filtered documents from the result.
 * - Inclusive filtering: setting filter values to `true`
 *   will include only the filtered documents in the result.
 *
 * @param documents - The documents to filter.
 * @param filters - The filters by which to filter.
 * @returns The filtered documents.
 */
export function filterResourceDocuments<
  TDocument extends ResourceDocument = ResourceDocument,
>(
  documents: ResourceDocumentMap<TDocument>,
  filters: ResourceDocumentFilters,
): ResourceDocumentMap<TDocument> {
  // Start with all documents
  let filtered = documents;

  if (Object.values(filters).includes(true)) {
    // If one of the filters is set to `true`, reset
    // filtered documents to perform inclusive filtering.
    filtered = {};
  }

  if (filters.active === false) {
    // Filter out active documents
    filtered = Object.values(filtered).reduce(
      (keep, document) =>
        document.deleted ? { ...keep, [document.id]: document } : keep,
      {},
    );
  }

  if (filters.deleted === false) {
    // Filter out deleted documents
    filtered = Object.values(filtered).reduce(
      (keep, document) =>
        document.deleted ? keep : { ...keep, [document.id]: document },
      {},
    );
  }

  if (filters.active === true) {
    // Filter in active documents
    const activeDocuments = Object.values(documents).reduce(
      (keep, document) =>
        document.deleted ? keep : { ...keep, [document.id]: document },
      {},
    );

    // Add active documents to previously filtered documents
    filtered = { ...filtered, ...activeDocuments };
  }

  if (filters.deleted === true) {
    // Filter in deleted documents
    const deletedDocuments = Object.values(documents).reduce(
      (keep, document) =>
        document.deleted ? { ...keep, [document.id]: document } : keep,
      {},
    );

    // Add deleted documents to previously filtered documents
    filtered = { ...filtered, ...deletedDocuments };
  }

  return filtered;
}
