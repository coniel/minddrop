import { dispatchViewArea } from '../dispatchViewArea';
import { getSet } from '../getSet';
import { writeSet } from '../writeSet';

/**
 * Closes every tab in the set except the one with the given id,
 * making it active.
 *
 * @param viewAreaId - The id of the view area.
 * @param id - The id of the tab to keep.
 */
export function closeOtherTabs(viewAreaId: string, id: string): void {
  const { tabs, activeTabId } = getSet(viewAreaId);

  // Find the tab to keep
  const tab = tabs.find((currentTab) => currentTab.id === id);

  // Nothing to do when the tab does not exist
  if (!tab) {
    return;
  }

  // Keep only the given tab, making it active
  writeSet(viewAreaId, { tabs: [tab], activeTabId: tab.id });

  // Show the kept tab's content when it was not already active
  if (activeTabId !== tab.id) {
    dispatchViewArea(viewAreaId, tab);
  }
}
