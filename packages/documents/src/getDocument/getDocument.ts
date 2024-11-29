import { Document } from '../types';
import { DocumentsStore } from '../DocumentsStore';

/**
 * Returns a document by ID, or null if it does not exist.
 *
 * @param id - The document ID.
 * @returns A document or null.
 */
export function getDocument<TDocument extends Document>(
  id: string,
): TDocument | null {
  return (
    (DocumentsStore.getState().documents.find(
      (document) => document.id === id,
    ) as TDocument) || null
  );
}
