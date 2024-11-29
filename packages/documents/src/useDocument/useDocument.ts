import { Document } from '../types';
import { DocumentsStore as useDocumentsStore } from '../DocumentsStore';

/**
 * Returns a document from the given id or null if not found.
 *
 * @param id - The document id.
 * @returns A document object or null.
 */
export function useDocument(id: string): Document | null {
  return (
    useDocumentsStore().documents.find((document) => document.id === id) || null
  );
}
