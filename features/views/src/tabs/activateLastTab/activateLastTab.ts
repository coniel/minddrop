import { activateTabByIndex } from '../activateTabByIndex';
import { getTabs } from '../getTabs';

/**
 * Activates the last tab in the set, if one exists.
 *
 * @param viewAreaId - The id of the view area.
 */
export function activateLastTab(viewAreaId: string): void {
  // Activate the tab at the final index
  activateTabByIndex(viewAreaId, getTabs(viewAreaId).length - 1);
}
