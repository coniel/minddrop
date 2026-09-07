import { dispatchViewArea } from '../dispatchViewArea';
import { getViewSessionSet } from '../getViewSessionSet';
import { updateViewSessionSet } from '../updateViewSessionSet';

/**
 * Closes the given session(s) in the view area. When the active
 * session is among them, the session taking its position is
 * activated, falling back to the one before it.
 *
 * @param viewAreaId - The id of the view area.
 * @param sessionIds - The id(s) of the session(s) to close.
 *
 * @dispatches app:view-area:set
 */
export function closeViewSession(
  viewAreaId: string,
  sessionIds: string | string[],
): void {
  const { sessions, activeSessionId } = getViewSessionSet(viewAreaId);
  const closedIds = Array.isArray(sessionIds) ? sessionIds : [sessionIds];

  // Remove the closed sessions from the view area
  const nextSessions = sessions.filter(
    (session) => !closedIds.includes(session.id),
  );

  // Nothing to do when none of the sessions exist
  if (nextSessions.length === sessions.length) {
    return;
  }

  // A background session was closed, so the active session is
  // unaffected; just store the remaining sessions.
  if (nextSessions.some((session) => session.id === activeSessionId)) {
    updateViewSessionSet(viewAreaId, { sessions: nextSessions });

    return;
  }

  // The active session was closed, so activate the session that took
  // its position, falling back to the previous one, or none when the
  // view area is now empty.
  const activeIndex = sessions.findIndex(
    (session) => session.id === activeSessionId,
  );
  const neighbour =
    nextSessions[Math.min(activeIndex, nextSessions.length - 1)] ?? null;

  // Store the remaining sessions and the new active session
  updateViewSessionSet(viewAreaId, {
    sessions: nextSessions,
    activeSessionId: neighbour?.id ?? null,
  });

  // Show the newly active session's content
  dispatchViewArea(viewAreaId, neighbour);
}
