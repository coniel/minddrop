import { dispatchViewArea } from '../dispatchViewArea';
import { getActiveTab } from '../getActiveTab';
import { getSet } from '../getSet';
import { MAX_HISTORY_LENGTH } from '../tabsConstants';
import { toHistoryEntry } from '../toHistoryEntry';
import { writeSet } from '../writeSet';

/**
 * Navigates the view area's active tab forward to the state it last
 * navigated back from. Does nothing when there is no history to go
 * forward to.
 *
 * @param viewAreaId - The id of the view area.
 *
 * @dispatches app:view-area:set
 */
export function goForward(viewAreaId: string): void {
  const tab = getActiveTab(viewAreaId);
  const forwardHistory = tab?.forwardHistory ?? [];

  // Nothing to navigate without a tab or forward history
  if (!tab || !forwardHistory.length) {
    return;
  }

  // Take the nearest entry as the state to restore
  const entry = forwardHistory[forwardHistory.length - 1];

  // Restore the entry's state onto the tab, moving the current state
  // onto the back history
  const updatedTab = {
    ...tab,
    main: entry.main,
    split: entry.split,
    splitRatio: entry.splitRatio,
    backHistory: [...(tab.backHistory ?? []), toHistoryEntry(tab)].slice(
      -MAX_HISTORY_LENGTH,
    ),
    forwardHistory: forwardHistory.slice(0, -1),
  };

  // Write the updated tab back into its set
  const { tabs } = getSet(viewAreaId);

  writeSet(viewAreaId, {
    tabs: tabs.map((setTab) => (setTab.id === tab.id ? updatedTab : setTab)),
  });

  // Show the restored state in the view area
  dispatchViewArea(viewAreaId, updatedTab);
}
