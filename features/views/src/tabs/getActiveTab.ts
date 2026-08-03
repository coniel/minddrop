import { Tab } from './TabSetsStore';
import { getSet } from './getSet';

/**
 * Returns the active tab in the given set, or null when there is none.
 *
 * @param viewAreaId - The id of the view area.
 */
export function getActiveTab(viewAreaId: string): Tab | null {
  const set = getSet(viewAreaId);

  // Find the tab matching the set's active id
  return set.tabs.find((tab) => tab.id === set.activeTabId) ?? null;
}
