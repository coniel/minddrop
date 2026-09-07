import { dispatchViewArea } from './dispatchViewArea';
import { getActiveViewSession } from './getActiveViewSession';

/**
 * Restores the active session's content into the view area.
 *
 * @param viewAreaId - The id of the view area.
 *
 * @dispatches app:view-area:set
 */
export function restoreActiveViewSession(viewAreaId: string): void {
  // Dispatch the active session's content into the view area
  dispatchViewArea(viewAreaId, getActiveViewSession(viewAreaId));
}
