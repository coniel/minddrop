import { dispatchViewArea } from '../dispatchViewArea';
import { getViewSession } from '../getViewSession';
import { updateViewSessionSet } from '../updateViewSessionSet';

/**
 * Activates the session with the given id in the view area and
 * restores its content.
 *
 * @param viewAreaId - The id of the view area.
 * @param sessionId - The id of the session to activate.
 *
 * @dispatches app:view-area:set
 */
export function setActiveViewSession(
  viewAreaId: string,
  sessionId: string,
): void {
  // Find the session to activate
  const session = getViewSession(viewAreaId, sessionId);

  // Nothing to do when the session does not exist
  if (!session) {
    return;
  }

  // Mark the session as active
  updateViewSessionSet(viewAreaId, { activeSessionId: sessionId });

  // Restore its content into the view area
  dispatchViewArea(viewAreaId, session);
}
