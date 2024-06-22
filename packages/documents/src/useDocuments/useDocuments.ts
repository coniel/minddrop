import { Document } from '../types';
import { DocumentsStore as useDocumentsStore } from '../DocumentsStore';

/**
 * Returns the user's documents.
 *
 * @returns An array of Document objects.
 */
export function useDocuments(): Document[] {
  return useDocumentsStore().documents;
}
