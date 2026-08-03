import { Tab } from '../TabSetsStore';
import { getTabs } from '../getTabs';
import { writeSet } from '../writeSet';

/**
 * Reorders the set's tabs to match the given ordered list of tab ids.
 *
 * @param viewAreaId - The id of the view area.
 * @param orderedIds - The tab ids in their new order.
 */
export function setTabOrder(viewAreaId: string, orderedIds: string[]): void {
  // Index the current tabs by id for lookup
  const tabsById = new Map(getTabs(viewAreaId).map((tab) => [tab.id, tab]));

  // Rebuild the tabs list in the given order, dropping any unknown ids
  const nextTabs = orderedIds
    .map((id) => tabsById.get(id))
    .filter((tab): tab is Tab => tab !== undefined);

  // Write the reordered tabs
  writeSet(viewAreaId, { tabs: nextTabs });
}
