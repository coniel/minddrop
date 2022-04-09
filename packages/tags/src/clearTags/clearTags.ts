import { TagsStore } from '../TagsStore';

/**
 * Clears tags from the store.
 * This method is **only intended for use in
 * tests**, do not use within your extension code.
 */
export function clearTags(): void {
  // Clear tags from the store
  TagsStore.clear();
}
