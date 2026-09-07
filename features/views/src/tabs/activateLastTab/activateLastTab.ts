import { ViewSessions } from '@minddrop/views';
import { activateTabByIndex } from '../activateTabByIndex';

/**
 * Activates the last tab in the view area, if one exists.
 *
 * @param viewAreaId - The id of the view area.
 */
export function activateLastTab(viewAreaId: string): void {
  // Activate the tab at the final index
  activateTabByIndex(viewAreaId, ViewSessions.getAll(viewAreaId).length - 1);
}
