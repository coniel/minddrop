import { TabSet, TabSetsStore } from './TabSetsStore';
import { getSet } from './getSet';

/**
 * Merges the given changes into the tab set with the given id.
 *
 * @param setId - The id of the tab set.
 * @param changes - The partial set data to merge.
 */
export function writeSet(setId: string, changes: Partial<TabSet>): void {
  // Merge the changes onto the current set and write it back
  TabSetsStore.set({ ...getSet(setId), ...changes });
}
