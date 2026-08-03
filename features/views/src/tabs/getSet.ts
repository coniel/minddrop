import { TabSet, TabSetsStore } from './TabSetsStore';

/**
 * Returns the tab set with the given id, or an empty set when none
 * exists yet.
 *
 * @param viewAreaId - The id of the view area.
 */
export function getSet(viewAreaId: string): TabSet {
  // Return the stored set, or an empty set when the id is not yet stored
  return (
    TabSetsStore.get(viewAreaId) ?? {
      id: viewAreaId,
      tabs: [],
      activeTabId: null,
    }
  );
}
