import { closeTab } from './closeTab';
import { getSet } from './getSet';

/**
 * Closes the active tab in the given set, if there is one.
 *
 * @param viewAreaId - The id of the view area.
 */
export function closeActiveTab(viewAreaId: string): void {
  const { activeTabId } = getSet(viewAreaId);

  // Close the active tab when there is one
  if (activeTabId) {
    closeTab(viewAreaId, activeTabId);
  }
}
