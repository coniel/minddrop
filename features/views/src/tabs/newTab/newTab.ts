import { createBlankTab } from '../createBlankTab';
import { dispatchViewArea } from '../dispatchViewArea';
import { getTabs } from '../getTabs';
import { writeSet } from '../writeSet';

export interface NewTabOptions {
  /**
   * The position at which to insert the tab. Defaults to the end
   * of the set.
   */
  index?: number;
}

/**
 * Opens a new blank tab in the given view area and makes it active.
 *
 * @param viewAreaId - The id of the view area.
 * @param options - Options for positioning the tab.
 */
export function newTab(viewAreaId: string, options: NewTabOptions = {}): void {
  const tabs = getTabs(viewAreaId);

  // Create a new blank tab
  const tab = createBlankTab();

  // Insert it at the requested position, or append it when none
  // was given
  const index = options.index ?? tabs.length;

  // Add it to the set and make it active
  writeSet(viewAreaId, {
    tabs: [...tabs.slice(0, index), tab, ...tabs.slice(index)],
    activeTabId: tab.id,
  });

  // Show the new (blank) tab in the view area
  dispatchViewArea(viewAreaId, tab);
}
