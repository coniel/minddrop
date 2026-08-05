import { TabHistoryEntry } from '../TabSetsStore';
import { ViewUpdateChanges, applyViewUpdate } from '../applyViewUpdate';
import { dispatchViewArea } from '../dispatchViewArea';
import { getActiveTab } from '../getActiveTab';
import { getSet } from '../getSet';
import { writeSet } from '../writeSet';

/**
 * Updates the view with the given instance id in the view area (e.g.
 * after a rename), setting its new id, props, title and icon. History
 * entries showing the view are patched as well so they don't go stale.
 *
 * @param viewAreaId - The id of the view area.
 * @param viewId - The instance id of the view to update.
 * @param changes - The new id, props (merged), title and icon.
 */
export function updateTabsForView(
  viewAreaId: string,
  viewId: string,
  changes: ViewUpdateChanges,
): void {
  const { tabs, activeTabId } = getSet(viewAreaId);

  // Whether any tab changed, and whether the active tab was among them
  let changed = false;
  let activeChanged = false;

  // Apply the changes to every tab's matching main and split view
  const nextTabs = tabs.map((tab) => {
    const main = applyViewUpdate(tab.main, viewId, changes);
    const split = applyViewUpdate(tab.split, viewId, changes);

    // Patch matching entries in the tab's history stacks
    const backHistory = patchHistoryEntries(tab.backHistory, viewId, changes);
    const forwardHistory = patchHistoryEntries(
      tab.forwardHistory,
      viewId,
      changes,
    );

    // Leave the tab untouched when nothing matched
    if (
      main === tab.main &&
      split === tab.split &&
      backHistory === tab.backHistory &&
      forwardHistory === tab.forwardHistory
    ) {
      return tab;
    }

    changed = true;

    // Track when the active tab's views changed so its content can
    // re-render, ignoring history-only patches
    if (tab.id === activeTabId && (main !== tab.main || split !== tab.split)) {
      activeChanged = true;
    }

    // Return the tab with its updated views and history
    return { ...tab, main, split, backHistory, forwardHistory };
  });

  // Nothing to write when no tab matched
  if (!changed) {
    return;
  }

  // Write the updated tabs
  writeSet(viewAreaId, { tabs: nextTabs });

  // Re-render the active view when its props changed (e.g. a new id)
  if (activeChanged) {
    dispatchViewArea(viewAreaId, getActiveTab(viewAreaId));
  }
}

/**
 * Returns the history entries with the changes applied to entries
 * showing the updated view, or the original array unchanged when no
 * entry matches.
 */
function patchHistoryEntries(
  entries: TabHistoryEntry[] | undefined,
  viewId: string,
  changes: ViewUpdateChanges,
): TabHistoryEntry[] | undefined {
  // Nothing to patch without any entries
  if (!entries) {
    return entries;
  }

  // Track whether any entry actually changed
  let changed = false;

  // Apply the changes to each entry's panes
  const patched = entries.map((entry) => {
    const main = applyViewUpdate(entry.main, viewId, changes);
    const split = applyViewUpdate(entry.split, viewId, changes);

    // Leave the entry untouched when neither pane matched
    if (main === entry.main && split === entry.split) {
      return entry;
    }

    changed = true;

    return { ...entry, main, split };
  });

  // Keep the original array's identity when nothing matched
  return changed ? patched : entries;
}
