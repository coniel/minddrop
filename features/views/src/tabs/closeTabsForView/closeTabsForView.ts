import { Tab } from '../TabSetsStore';
import { dispatchViewArea } from '../dispatchViewArea';
import { getActiveTab } from '../getActiveTab';
import { getSet } from '../getSet';
import { pruneHistoryEntries } from '../pruneHistoryEntries';
import { DEFAULT_SPLIT_RATIO } from '../tabsConstants';
import { viewMatches } from '../viewMatches';
import { writeSet } from '../writeSet';

/**
 * Closes the view with the given instance id in the view area. When it
 * matches a split view, only the split is cleared. The view is also
 * pruned out of the surviving tabs' history stacks.
 *
 * @param viewAreaId - The id of the view area.
 * @param viewId - The instance id of the view to close.
 */
export function closeTabsForView(viewAreaId: string, viewId: string): void {
  const { tabs, activeTabId } = getSet(viewAreaId);

  // Remember the active tab's position to pick a neighbour later
  const activeIndex = tabs.findIndex((tab) => tab.id === activeTabId);
  let changed = false;

  // Build the next tabs list, dropping or clearing matching views
  const nextTabs: Tab[] = [];

  tabs.forEach((tab) => {
    // The main view matches, drop the whole tab
    if (viewMatches(tab.main, viewId)) {
      changed = true;

      return;
    }

    // Prune the closed view out of the tab's history stacks
    const currentBackHistory = tab.backHistory ?? [];
    const currentForwardHistory = tab.forwardHistory ?? [];
    const backHistory = pruneHistoryEntries(currentBackHistory, viewId);
    const forwardHistory = pruneHistoryEntries(currentForwardHistory, viewId);

    // Whether either stack was actually pruned
    const historyChanged =
      backHistory !== currentBackHistory ||
      forwardHistory !== currentForwardHistory;

    // Only the split matches, clear it and reset the split ratio
    if (viewMatches(tab.split, viewId)) {
      changed = true;
      nextTabs.push({
        ...tab,
        split: null,
        splitRatio: DEFAULT_SPLIT_RATIO,
        backHistory,
        forwardHistory,
      });

      return;
    }

    // Neither pane matched, but the view was pruned from the history
    if (historyChanged) {
      changed = true;
      nextTabs.push({ ...tab, backHistory, forwardHistory });

      return;
    }

    // Nothing matched at all, keep the tab as-is
    nextTabs.push(tab);
  });

  // Nothing to write when no tab matched
  if (!changed) {
    return;
  }

  // The active tab was dropped, so activate a neighbour at its old
  // position
  if (!nextTabs.some((tab) => tab.id === activeTabId)) {
    const neighbour =
      nextTabs[Math.min(activeIndex, nextTabs.length - 1)] ?? null;

    // Write the remaining tabs and the new active tab
    writeSet(viewAreaId, {
      tabs: nextTabs,
      activeTabId: neighbour?.id ?? null,
    });

    // Show the newly active tab's content
    dispatchViewArea(viewAreaId, neighbour);

    return;
  }

  // The active tab survived, so write the tabs and re-sync its content
  // in case its split was cleared
  writeSet(viewAreaId, { tabs: nextTabs });
  dispatchViewArea(viewAreaId, getActiveTab(viewAreaId));
}
