import { Document } from '../types';
import { DocumentsStore } from '../DocumentsStore';

/**
 * Returns a document by path, or null if it does not exist.
 *
 * @param path - The document path.
 * @returns A document or null.
 */
export function getDocument(path: string): Document | null {
  return (
    DocumentsStore.getState().documents.find(
      (document) => document.path === path,
    ) || null
  );
}
