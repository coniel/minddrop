import { dispatchViewArea } from '../dispatchViewArea';
import { getActiveTab } from '../getActiveTab';
import { getSet } from '../getSet';
import { MAX_HISTORY_LENGTH } from '../tabsConstants';
import { toHistoryEntry } from '../toHistoryEntry';
import { writeSet } from '../writeSet';

/**
 * Navigates the view area's active tab back to the previous state in
 * its history. Does nothing when there is no history to go back to.
 *
 * @param viewAreaId - The id of the view area.
 *
 * @dispatches app:view-area:set
 */
export function goBack(viewAreaId: string): void {
  const tab = getActiveTab(viewAreaId);
  const backHistory = tab?.backHistory ?? [];

  // Nothing to navigate without a tab or back history
  if (!tab || !backHistory.length) {
    return;
  }

  // Take the nearest entry as the state to restore
  const entry = backHistory[backHistory.length - 1];

  // Restore the entry's state onto the tab, moving the current state
  // onto the forward history
  const updatedTab = {
    ...tab,
    main: entry.main,
    split: entry.split,
    splitRatio: entry.splitRatio,
    viewState: entry.viewState ?? {},
    backHistory: backHistory.slice(0, -1),
    forwardHistory: [...(tab.forwardHistory ?? []), toHistoryEntry(tab)].slice(
      -MAX_HISTORY_LENGTH,
    ),
  };

  // Write the updated tab back into its set
  const { tabs } = getSet(viewAreaId);

  writeSet(viewAreaId, {
    tabs: tabs.map((setTab) => (setTab.id === tab.id ? updatedTab : setTab)),
  });

  // Show the restored state in the view area
  dispatchViewArea(viewAreaId, updatedTab);
}
