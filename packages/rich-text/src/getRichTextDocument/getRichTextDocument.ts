import { RichTextDocumentNotFoundError } from '../errors';
import { RichTextDocument } from '../types';
import { useRichTextStore } from '../useRichTextStore';

/**
 * Returns a rich text document by ID.
 *
 * - Throws a `RichTextDocumentNotFoundError` if the document
 *   does not exist.
 *
 * @param documentId The ID of the document to retrieve.
 */
export function getRichTextDocument(documentId: string): RichTextDocument {
  // Get the document from the rich text store
  const document = useRichTextStore.getState().documents[documentId];

  if (!document) {
    // Throw a `RichTextDocumentNotFoundError` if the document
    // does not exist, providing the ID of the missing document.
    throw new RichTextDocumentNotFoundError(documentId);
  }

  // Return the document
  return document;
}
