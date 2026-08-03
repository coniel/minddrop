import { SetViewAreaEventData } from '@minddrop/events';
import { createBlankTab } from '../createBlankTab';
import { getSet } from '../getSet';
import { toTabView } from '../toTabView';
import { writeSet } from '../writeSet';

/**
 * Records the current view area state onto the active tab. Creates an
 * active tab first when none exists.
 *
 * @param viewAreaId - The id of the view area.
 * @param state - The current view area state.
 */
export function recordViewArea(
  viewAreaId: string,
  state: SetViewAreaEventData,
): void {
  const set = getSet(viewAreaId);
  let tabs = set.tabs;
  let activeTabId = set.activeTabId;

  // Ensure there is an active tab to record onto
  if (!activeTabId || !tabs.some((tab) => tab.id === activeTabId)) {
    // Create a blank tab and make it the active one
    const tab = createBlankTab();

    tabs = [...tabs, tab];
    activeTabId = tab.id;
  }

  // Record the state onto the active tab, leaving the others untouched
  const nextTabs = tabs.map((tab) => {
    // Leave the non-active tabs untouched
    if (tab.id !== activeTabId) {
      return tab;
    }

    // Overwrite the active tab's views and split ratio with the state
    return {
      ...tab,
      main: toTabView(state.main),
      split: toTabView(state.split),
      splitRatio: state.splitRatio,
    };
  });

  // Write the updated tabs and active tab
  writeSet(viewAreaId, { tabs: nextTabs, activeTabId });
}
