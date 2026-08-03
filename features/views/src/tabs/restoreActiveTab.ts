import { dispatchViewArea } from './dispatchViewArea';
import { getActiveTab } from './getActiveTab';

/**
 * Restores the active tab's content into the view area.
 *
 * @param viewAreaId - The id of the view area.
 */
export function restoreActiveTab(viewAreaId: string): void {
  // Dispatch the active tab's content into the view area
  dispatchViewArea(viewAreaId, getActiveTab(viewAreaId));
}
