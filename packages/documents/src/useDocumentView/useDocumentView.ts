import { DocumentView } from '../types';
import { DocumentViewsStore as useDocumentViewsStore } from '../DocumentViewsStore';

/**
 * Returns a document view from the given id or null if not found.
 *
 * @param id - The document view id.
 * @returns A document view object or null.
 */
export function useDocumentView(id: string): DocumentView | null {
  return useDocumentViewsStore().documents[id] || null;
}