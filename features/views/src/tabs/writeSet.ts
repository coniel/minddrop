import { TabSet, TabSetsStore } from './TabSetsStore';
import { getSet } from './getSet';

/**
 * Merges the given changes into the tab set with the given id.
 *
 * @param viewAreaId - The id of the view area.
 * @param changes - The partial set data to merge.
 */
export function writeSet(viewAreaId: string, changes: Partial<TabSet>): void {
  // Merge the changes onto the current set and write it back
  TabSetsStore.set({ ...getSet(viewAreaId), ...changes });
}
