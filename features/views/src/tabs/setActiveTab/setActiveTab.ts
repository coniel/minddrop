import { dispatchViewArea } from '../dispatchViewArea';
import { getTabs } from '../getTabs';
import { writeSet } from '../writeSet';

/**
 * Activates the tab with the given id in the view area and restores
 * its content.
 *
 * @param viewAreaId - The id of the view area.
 * @param id - The id of the tab to activate.
 */
export function setActiveTab(viewAreaId: string, id: string): void {
  // Find the tab to activate
  const tab = getTabs(viewAreaId).find((tab) => tab.id === id);

  // Nothing to do when the tab does not exist
  if (!tab) {
    return;
  }

  // Mark the tab as active
  writeSet(viewAreaId, { activeTabId: id });

  // Restore its content into the view area
  dispatchViewArea(viewAreaId, tab);
}
