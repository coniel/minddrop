import { RichTextDocument } from '../types';
import { useRichTextStore } from '../useRichTextStore';

/**
 * Returns a rich text document by ID or `null` if
 * the document does not exist.
 */
export function useRichTextDocument(
  documentId: string,
): RichTextDocument | null {
  // Get documents from the store
  const { documents } = useRichTextStore();

  // Return the requested document
  return documents[documentId] || null;
}
