import { dispatchViewArea } from '../dispatchViewArea';
import { getActiveTab } from '../getActiveTab';
import { getSet } from '../getSet';
import { MAX_HISTORY_LENGTH } from '../tabsConstants';
import { toHistoryEntry } from '../toHistoryEntry';
import { writeSet } from '../writeSet';

/**
 * Navigates the view area's active tab back through its history. Does
 * nothing when there is no history to go back to.
 *
 * @param viewAreaId - The id of the view area.
 * @param steps - How many entries to navigate back through, clamped to the available history.
 *
 * @dispatches app:view-area:set
 */
export function goBack(viewAreaId: string, steps = 1): void {
  const tab = getActiveTab(viewAreaId);
  const backHistory = tab?.backHistory ?? [];

  // Nothing to navigate without a tab or back history
  if (!tab || !backHistory.length) {
    return;
  }

  // Clamp the requested steps to the available history
  const stepCount = Math.min(Math.max(steps, 1), backHistory.length);

  // The index of the entry whose state is restored
  const entryIndex = backHistory.length - stepCount;
  const entry = backHistory[entryIndex];

  // The entries navigated past, ordered nearest to the restored entry
  // last so they are navigated forward through in reverse
  const skipped = backHistory.slice(entryIndex + 1).reverse();

  // Restore the entry's state onto the tab, moving the current state
  // and the entries navigated past onto the forward history
  const updatedTab = {
    ...tab,
    main: entry.main,
    split: entry.split,
    splitRatio: entry.splitRatio,
    viewState: entry.viewState ?? {},
    backHistory: backHistory.slice(0, entryIndex),
    forwardHistory: [
      ...(tab.forwardHistory ?? []),
      toHistoryEntry(tab),
      ...skipped,
    ].slice(-MAX_HISTORY_LENGTH),
  };

  // Write the updated tab back into its set
  const { tabs } = getSet(viewAreaId);

  writeSet(viewAreaId, {
    tabs: tabs.map((setTab) => (setTab.id === tab.id ? updatedTab : setTab)),
  });

  // Show the restored state in the view area
  dispatchViewArea(viewAreaId, updatedTab);
}
