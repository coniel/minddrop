import { ViewAreaChangedEventData, ViewDescriptor } from '@minddrop/views';
import { TabView } from '../TabSetsStore';
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
  state: ViewAreaChangedEventData,
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

    // Whether a pane's view shows a different entity within itself,
    // which is navigated to without the view itself changing
    const subviewChanged =
      !sameSubview(tab.main, state.main) ||
      !sameSubview(tab.split, state.split);

    // Replaying states (e.g. a view selecting a default) are recorded
    // without becoming history
    const navigated =
      !state.replace && (mainNavigated || splitNavigated || subviewChanged);

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

    // Reset the transient state of panes that navigated to a different
    // view (their history snapshot was captured above), keeping the
    // state of panes that merely replayed or changed subview
    const viewState =
      mainNavigated || splitNavigated
        ? {
            main: mainNavigated ? {} : tab.viewState?.main,
            split: splitNavigated ? {} : tab.viewState?.split,
          }
        : tab.viewState;

    // Keep the tab as it is when the state merely replays what it
    // already shows, so subscribers and the persisted set are left
    // untouched
    if (
      !navigated &&
      sameTabView(tab.main, state.main) &&
      sameTabView(tab.split, state.split) &&
      tab.splitRatio === state.splitRatio
    ) {
      return tab;
    }

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

  // Whether the recording changed anything at all
  const changed =
    activeTabId !== set.activeTabId ||
    nextTabs.some((tab, index) => set.tabs[index] !== tab);

  // Nothing to write when every tab was left as it was
  if (!changed) {
    return;
  }

  // Write the updated tabs and active tab
  writeSet(viewAreaId, { tabs: nextTabs, activeTabId });
}

/**
 * Whether two views show the same thing, down to the metadata they
 * and their subview are labelled by.
 */
function sameTabView(
  a: TabView | ViewDescriptor | null,
  b: TabView | ViewDescriptor | null,
): boolean {
  return (
    sameView(a, b) &&
    sameSubview(a, b) &&
    a?.title === b?.title &&
    a?.icon === b?.icon &&
    a?.subview?.title === b?.subview?.title &&
    a?.subview?.icon === b?.subview?.icon
  );
}

/**
 * Whether two views show the same entity within themselves.
 */
function sameSubview(
  a: TabView | ViewDescriptor | null,
  b: TabView | ViewDescriptor | null,
): boolean {
  return a?.subview?.id === b?.subview?.id;
}
