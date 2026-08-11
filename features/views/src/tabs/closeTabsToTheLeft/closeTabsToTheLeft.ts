import { dispatchViewArea } from '../dispatchViewArea';
import { getSet } from '../getSet';
import { writeSet } from '../writeSet';

/**
 * Closes every tab positioned before the tab with the given id.
 *
 * @param viewAreaId - The id of the view area.
 * @param id - The id of the tab to close the tabs before.
 */
export function closeTabsToTheLeft(viewAreaId: string, id: string): void {
  const { tabs, activeTabId } = getSet(viewAreaId);

  // Find the tab to close the tabs before
  const index = tabs.findIndex((tab) => tab.id === id);

  // Nothing to do when the tab does not exist
  if (index === -1) {
    return;
  }

  // Drop the tabs positioned before it
  const nextTabs = tabs.slice(index);

  // Whether the active tab was among the closed ones
  const closedActiveTab = !nextTabs.some((tab) => tab.id === activeTabId);

  // The active tab remains open, so just write the remaining tabs
  if (!closedActiveTab) {
    writeSet(viewAreaId, { tabs: nextTabs });

    return;
  }

  // The active tab was closed, so activate the tab the remaining
  // tabs start on
  writeSet(viewAreaId, { tabs: nextTabs, activeTabId: id });

  // Show the newly active tab's content
  dispatchViewArea(viewAreaId, tabs[index]);
}
