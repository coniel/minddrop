import { Tab } from '../TabSetsStore';
import { getSet } from '../getSet';
import { writeSet } from '../writeSet';

/**
 * Merges the given changes into the tab with the given id in the
 * view area. Does nothing when the tab does not exist.
 *
 * @param viewAreaId - The id of the view area.
 * @param tabId - The id of the tab to update.
 * @param changes - The partial tab data to merge.
 */
export function updateTab(
  viewAreaId: string,
  tabId: string,
  changes: Partial<Omit<Tab, 'id'>>,
): void {
  const { tabs } = getSet(viewAreaId);

  // Nothing to do when the tab does not exist
  if (!tabs.some((tab) => tab.id === tabId)) {
    return;
  }

  // Merge the changes onto the matching tab, leaving the others
  // untouched
  writeSet(viewAreaId, {
    tabs: tabs.map((tab) => (tab.id === tabId ? { ...tab, ...changes } : tab)),
  });
}
