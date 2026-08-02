import { dispatchMainContent } from '../dispatchMainContent';
import { getTabs } from '../getTabs';
import { writeSet } from '../writeSet';

/**
 * Activates the tab with the given id in the set and restores its
 * content.
 *
 * @param setId - The id of the tab set.
 * @param id - The id of the tab to activate.
 */
export function setActiveTab(setId: string, id: string): void {
  // Find the tab to activate
  const tab = getTabs(setId).find((tab) => tab.id === id);

  // Nothing to do when the tab does not exist
  if (!tab) {
    return;
  }

  // Mark the tab as active
  writeSet(setId, { activeTabId: id });

  // Restore its content into the main content area
  dispatchMainContent(tab);
}
