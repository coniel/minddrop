import { dispatchMainContent } from './dispatchMainContent';
import { getActiveTab } from './getActiveTab';

/**
 * Restores the active tab's content into the main content area.
 *
 * @param setId - The id of the tab set.
 */
export function restoreActiveTab(setId: string): void {
  // Dispatch the active tab's content into the main content area
  dispatchMainContent(getActiveTab(setId));
}
