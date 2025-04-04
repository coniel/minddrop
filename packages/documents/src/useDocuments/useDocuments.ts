import { DocumentsStore as useDocumentsStore } from '../DocumentsStore';
import { Document } from '../types';

/**
 * Returns a list of documents by their IDs.
 *
 * @param ids - The document IDs to retrieve.
 * @returns An array of documents.
 */
export function useDocuments(ids: string[]): Document[] {
  // Get all documents
  const { documents } = useDocumentsStore();

  // Get documents and sort them by title in alphabetical order
  return Object.values(documents)
    .filter((document) => ids.includes(document.id))
    .sort((a, b) => (a.title > b.title ? 1 : -1));
}
