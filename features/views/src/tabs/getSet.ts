import { TabSet, TabSetsStore } from './TabSetsStore';

/**
 * Returns the tab set with the given id, or an empty set when none
 * exists yet.
 *
 * @param setId - The id of the tab set.
 */
export function getSet(setId: string): TabSet {
  // Return the stored set, or an empty set when the id is not yet stored
  return TabSetsStore.get(setId) ?? { id: setId, tabs: [], activeTabId: null };
}
