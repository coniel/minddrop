import { SetMainContentEventData } from '@minddrop/events';
import { createBlankTab } from '../createBlankTab';
import { getSet } from '../getSet';
import { toTabView } from '../toTabView';
import { writeSet } from '../writeSet';

/**
 * Records the current main content state onto the set's active tab.
 * Creates an active tab first when none exists.
 *
 * @param setId - The id of the tab set.
 * @param state - The current main content state.
 */
export function recordMainContent(
  setId: string,
  state: SetMainContentEventData,
): void {
  const set = getSet(setId);
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
  writeSet(setId, { tabs: nextTabs, activeTabId });
}
