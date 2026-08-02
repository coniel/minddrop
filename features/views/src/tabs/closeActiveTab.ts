import { closeTab } from './closeTab';
import { getSet } from './getSet';

/**
 * Closes the active tab in the given set, if there is one.
 *
 * @param setId - The id of the tab set.
 */
export function closeActiveTab(setId: string): void {
  const { activeTabId } = getSet(setId);

  // Close the active tab when there is one
  if (activeTabId) {
    closeTab(setId, activeTabId);
  }
}
