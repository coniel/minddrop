import { filterResourceDocuments } from '../filterResourceDocuments';
import {
  TypedResourceDocument,
  TypedResourceDocumentFilters,
  TypedResourceDocumentMap,
} from '../types';

/**
 * Filters are resource document map according the
 * the provided filters.
 *
 * Boolean filters operate in one of two modes:
 * - Exclusive filtering: setting filter values to `false`
 *   will remove the filtered documents from the result.
 * - Inclusive filtering: setting filter values to `true`
 *   will include only the filtered documents in the result.
 *
 * @param documents - The documents to filter.
 * @param filters - The filters by which to filter.
 * @returns The filtered documents.
 */
export function filterTypedResourceDocuments<
  TDocument extends TypedResourceDocument = TypedResourceDocument,
>(
  documents: TypedResourceDocumentMap<TDocument>,
  filters: TypedResourceDocumentFilters,
): TypedResourceDocumentMap<TDocument> {
  // Start with all documents
  let filtered = documents;

  if (filters.type) {
    // Filter documents by type
    filtered = Object.values(filtered).reduce(
      (keep, document) =>
        filters.type.includes(document.type)
          ? { ...keep, [document.id]: document }
          : keep,
      {},
    );
  }

  return filterResourceDocuments(filtered, filters);
}
