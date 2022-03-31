import { useRichTextStore } from '../useRichTextStore';

/**
 * Clears all rich text documents from the store.
 * This method is **only intended for use in
 * tests**, do not use within your extension code.
 */
export function clearRichTextDocuments(): void {
  // Clear rich text documents from the store
  useRichTextStore.getState().clearDocuments();
}
