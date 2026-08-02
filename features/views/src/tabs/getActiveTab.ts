import { Tab } from './TabSetsStore';
import { getSet } from './getSet';

/**
 * Returns the active tab in the given set, or null when there is none.
 *
 * @param setId - The id of the tab set.
 */
export function getActiveTab(setId: string): Tab | null {
  const set = getSet(setId);

  // Find the tab matching the set's active id
  return set.tabs.find((tab) => tab.id === set.activeTabId) ?? null;
}
