import { getTabs } from './getTabs';
import { newTab } from './newTab';

/**
 * Creates a blank tab in the set when it has no tabs.
 *
 * @param setId - The id of the tab set.
 */
export function ensureTab(setId: string): void {
  // Open a blank tab when the set is empty
  if (getTabs(setId).length === 0) {
    newTab(setId);
  }
}
