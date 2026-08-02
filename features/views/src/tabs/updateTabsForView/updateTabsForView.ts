import { applyViewUpdate } from '../applyViewUpdate';
import { dispatchMainContent } from '../dispatchMainContent';
import { getActiveTab } from '../getActiveTab';
import { getSet } from '../getSet';
import { writeSet } from '../writeSet';

/**
 * Updates the view with the given instance id in the set (e.g. after a
 * rename), setting its new id, props, title and icon.
 *
 * @param setId - The id of the tab set.
 * @param viewId - The instance id of the view to update.
 * @param changes - The new id, props (merged), title and icon.
 */
export function updateTabsForView(
  setId: string,
  viewId: string,
  changes: {
    id?: string;
    props?: Record<string, unknown>;
    title?: string;
    icon?: string;
  },
): void {
  const { tabs, activeTabId } = getSet(setId);

  // Whether any tab changed, and whether the active tab was among them
  let changed = false;
  let activeChanged = false;

  // Apply the changes to every tab's matching main and split view
  const nextTabs = tabs.map((tab) => {
    const main = applyViewUpdate(tab.main, viewId, changes);
    const split = applyViewUpdate(tab.split, viewId, changes);

    // Leave the tab untouched when neither view matched
    if (main === tab.main && split === tab.split) {
      return tab;
    }

    changed = true;

    // Track when the active tab changed so its content can re-render
    if (tab.id === activeTabId) {
      activeChanged = true;
    }

    // Return the tab with its updated views
    return { ...tab, main, split };
  });

  // Nothing to write when no tab matched
  if (!changed) {
    return;
  }

  // Write the updated tabs
  writeSet(setId, { tabs: nextTabs });

  // Re-render the active view when its props changed (e.g. a new id)
  if (activeChanged) {
    dispatchMainContent(getActiveTab(setId));
  }
}
