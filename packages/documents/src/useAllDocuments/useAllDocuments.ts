import { DocumentsStore as useDocumentsStore } from '../DocumentsStore';
import { Document } from '../types';

/**
 * Returns all documents.
 *
 * @returns An array of document objects.
 */
export function useAllDocuments(): Document[] {
  return Object.values(useDocumentsStore().documents);
}
