import { createBlankTab } from '../createBlankTab';
import { dispatchMainContent } from '../dispatchMainContent';
import { getTabs } from '../getTabs';
import { writeSet } from '../writeSet';

/**
 * Opens a new blank tab in the given set and makes it active.
 *
 * @param setId - The id of the tab set.
 */
export function newTab(setId: string): void {
  // Create a new blank tab
  const tab = createBlankTab();

  // Append it to the set and make it active
  writeSet(setId, { tabs: [...getTabs(setId), tab], activeTabId: tab.id });

  // Show the new (blank) tab in the main content area
  dispatchMainContent(tab);
}
