import { createBlankTab } from '../createBlankTab';
import { dispatchViewArea } from '../dispatchViewArea';
import { getTabs } from '../getTabs';
import { writeSet } from '../writeSet';

/**
 * Opens a new blank tab in the given view area and makes it active.
 *
 * @param viewAreaId - The id of the view area.
 */
export function newTab(viewAreaId: string): void {
  // Create a new blank tab
  const tab = createBlankTab();

  // Append it to the set and make it active
  writeSet(viewAreaId, {
    tabs: [...getTabs(viewAreaId), tab],
    activeTabId: tab.id,
  });

  // Show the new (blank) tab in the view area
  dispatchViewArea(viewAreaId, tab);
}
