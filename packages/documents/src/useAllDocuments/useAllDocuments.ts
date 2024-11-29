import { Document } from '../types';
import { DocumentsStore as useDocumentsStore } from '../DocumentsStore';

/**
 * Returns all documents.
 *
 * @returns An array of document objects.
 */
export function useAllDocuments(): Document[] {
  return useDocumentsStore().documents;
}
