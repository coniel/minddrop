import { TabView } from '../TabSetsStore';
import { dispatchViewArea } from '../dispatchViewArea';
import { getSet } from '../getSet';
import { writeSet } from '../writeSet';

/**
 * Opens the given view in the split pane of the tab with the given
 * id, making the tab active.
 *
 * @param viewAreaId - The id of the view area.
 * @param tabId - The id of the tab to split.
 * @param view - The view to show in the split pane.
 */
export function splitTab(
  viewAreaId: string,
  tabId: string,
  view: TabView,
): void {
  const { tabs } = getSet(viewAreaId);

  // Find the tab to split
  const tab = tabs.find((currentTab) => currentTab.id === tabId);

  // Nothing to do when the tab does not exist
  if (!tab) {
    return;
  }

  // Add the view to the tab's split pane
  const nextTab = { ...tab, split: view };

  // Write the updated tab and make it active
  writeSet(viewAreaId, {
    tabs: tabs.map((currentTab) =>
      currentTab.id === tabId ? nextTab : currentTab,
    ),
    activeTabId: tabId,
  });

  // Show the split tab's content
  dispatchViewArea(viewAreaId, nextTab);
}
