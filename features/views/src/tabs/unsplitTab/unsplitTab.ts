import { createBlankTab } from '../createBlankTab';
import { dispatchViewArea } from '../dispatchViewArea';
import { getSet } from '../getSet';
import { DEFAULT_SPLIT_RATIO } from '../tabsConstants';
import { writeSet } from '../writeSet';

/**
 * Closes the split pane of the tab with the given id, moving its view
 * into a new tab positioned after it.
 *
 * @param viewAreaId - The id of the view area.
 * @param tabId - The id of the tab to unsplit.
 */
export function unsplitTab(viewAreaId: string, tabId: string): void {
  const { tabs, activeTabId } = getSet(viewAreaId);

  // Find the tab to unsplit
  const index = tabs.findIndex((tab) => tab.id === tabId);
  const tab = tabs[index];

  // Nothing to do when the tab does not exist or is not split
  if (!tab?.split) {
    return;
  }

  // Drop the split pane, resetting the pane widths
  const nextTab = {
    ...tab,
    split: null,
    splitRatio: DEFAULT_SPLIT_RATIO,
  };

  // Move the split pane's view and transient state into a new tab
  const splitPaneTab = {
    ...createBlankTab(),
    main: tab.split,
    viewState: { main: tab.viewState?.split },
  };

  // Write the unsplit tab followed by the split pane's tab
  writeSet(viewAreaId, {
    tabs: [
      ...tabs.slice(0, index),
      nextTab,
      splitPaneTab,
      ...tabs.slice(index + 1),
    ],
  });

  // Show the unsplit content when the tab is the active one
  if (activeTabId === tabId) {
    dispatchViewArea(viewAreaId, nextTab);
  }
}
