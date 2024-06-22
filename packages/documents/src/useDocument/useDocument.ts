import { Document } from '../types';
import { DocumentsStore as useDocumentsStore } from '../DocumentsStore';

/**
 * Returns a document from the given path, or `null` if there is
 * no document with the given path.
 *
 * @param path - The document path.
 * @returns A document object or null.
 */
export function useDocument(path: string): Document | null {
  return useDocumentsStore().documents.find((document) => document.path === path) || null;
}
