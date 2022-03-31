import { RichTextDocumentMap } from '../types';
import { useRichTextStore } from '../useRichTextStore';

/**
 * Retrurns all rich text documents from the store as a
 * `{ [id]: RichTextDocument }` map.
 */
export function getAllRichTextDocuments(): RichTextDocumentMap {
  // Return all rich text documents from the store
  return useRichTextStore.getState().documents;
}
