import { getTabs } from './getTabs';
import { newTab } from './newTab';

/**
 * Creates a blank tab in the set when it has no tabs.
 *
 * @param viewAreaId - The id of the view area.
 */
export function ensureTab(viewAreaId: string): void {
  // Open a blank tab when the set is empty
  if (getTabs(viewAreaId).length === 0) {
    newTab(viewAreaId);
  }
}
