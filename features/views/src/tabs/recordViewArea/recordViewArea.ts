import { SetViewAreaEventData } from '@minddrop/events';
import { createBlankTab } from '../createBlankTab';
import { getSet } from '../getSet';
import { sameView } from '../sameView';
import { MAX_HISTORY_LENGTH } from '../tabsConstants';
import { toHistoryEntry } from '../toHistoryEntry';
import { toTabView } from '../toTabView';
import { writeSet } from '../writeSet';

/**
 * Records the current view area state onto the active tab, pushing
 * the tab's previous state onto its back history when the state is a
 * new navigation. Creates an active tab first when none exists.
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

    // Whether each pane shows a different view than before, as opposed
    // to a replay of its current state (e.g. a tab restore) or a
    // metadata/split ratio refresh
    const mainNavigated = !sameView(tab.main, state.main);
    const splitNavigated = !sameView(tab.split, state.split);
    const navigated = mainNavigated || splitNavigated;

    // Push the previous state onto the back history on navigation,
    // except when navigating away from a blank tab
    const backHistory =
      navigated && tab.main
        ? [...(tab.backHistory ?? []), toHistoryEntry(tab)].slice(
            -MAX_HISTORY_LENGTH,
          )
        : (tab.backHistory ?? []);

    // Navigating clears the forward history, replays preserve it
    const forwardHistory = navigated ? [] : (tab.forwardHistory ?? []);

    // Reset the transient state of panes that navigated (their history
    // snapshot was captured above), keeping the state of panes that
    // merely replayed
    const viewState = navigated
      ? {
          main: mainNavigated ? {} : tab.viewState?.main,
          split: splitNavigated ? {} : tab.viewState?.split,
        }
      : tab.viewState;

    // Overwrite the active tab's views and split ratio with the state
    return {
      ...tab,
      main: toTabView(state.main),
      split: toTabView(state.split),
      splitRatio: state.splitRatio,
      backHistory,
      forwardHistory,
      viewState,
    };
  });

  // Write the updated tabs and active tab
  writeSet(viewAreaId, { tabs: nextTabs, activeTabId });
}
