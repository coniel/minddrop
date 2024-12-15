import { DocumentsStore } from '../DocumentsStore';
import { Document } from '../types';

/**
 * Returns a document by ID, or null if it does not exist.
 *
 * @param id - The document ID.
 * @returns A document or null.
 */
export function getDocument<TDocument extends Document>(
  id: string,
): TDocument | null {
  return (DocumentsStore.getState().documents[id] as TDocument) || null;
}
