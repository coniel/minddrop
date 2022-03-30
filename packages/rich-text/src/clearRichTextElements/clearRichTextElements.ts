import { useRichTextStore } from '../useRichTextStore';

/**
 * Clears all rich text elements from the store.
 * This method is **only intended for use in
 * tests**, do not use within your extension code.
 */
export function clearRichTextElements(): void {
  // Clear rich text elements from the store
  useRichTextStore.getState().clearElements();
}
