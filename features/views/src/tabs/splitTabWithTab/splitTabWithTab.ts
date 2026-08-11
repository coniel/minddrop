import { dispatchViewArea } from '../dispatchViewArea';
import { getSet } from '../getSet';
import { writeSet } from '../writeSet';

/**
 * Moves the main view of the source tab into the split pane of the
 * target tab, closing the source tab and making the target active.
 *
 * @param viewAreaId - The id of the view area.
 * @param tabId - The id of the tab to split.
 * @param sourceTabId - The id of the tab to move into the split pane.
 */
export function splitTabWithTab(
  viewAreaId: string,
  tabId: string,
  sourceTabId: string,
): void {
  const { tabs } = getSet(viewAreaId);

  // Find the tab to split
  const tab = tabs.find((currentTab) => currentTab.id === tabId);

  // Find the tab to move into the split pane
  const sourceTab = tabs.find((currentTab) => currentTab.id === sourceTabId);

  // Nothing to do when either tab does not exist, or the source tab
  // has no view to move
  if (!tab || !sourceTab?.main) {
    return;
  }

  // Show the source tab's view in the target tab's split pane
  const nextTab = { ...tab, split: sourceTab.main };

  // Write the updated tab, dropping the source tab, and make the
  // split tab active
  writeSet(viewAreaId, {
    tabs: tabs
      .filter((currentTab) => currentTab.id !== sourceTabId)
      .map((currentTab) => (currentTab.id === tabId ? nextTab : currentTab)),
    activeTabId: tabId,
  });

  // Show the split tab's content
  dispatchViewArea(viewAreaId, nextTab);
}
