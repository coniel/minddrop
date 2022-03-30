import { useRichTextStore } from '../useRichTextStore';

/**
 * Clears registered rich text element configs from the store.
 * This method is **only intended for use in tests**, do not
 * use within your extension code.
 */
export function clearRegisteredRichTextElementTypes(): void {
  // Clear registered rich text element configs from the store
  useRichTextStore.getState().clearElementConfigs();
}
