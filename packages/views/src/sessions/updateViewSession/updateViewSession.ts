import { ViewSession } from '../../types';
import { getViewSessionSet } from '../getViewSessionSet';
import { updateViewSessionSet } from '../updateViewSessionSet';

/**
 * Merges the given changes into the session with the given id in the
 * view area. Does nothing when the session does not exist.
 *
 * @param viewAreaId - The id of the view area.
 * @param sessionId - The id of the session to update.
 * @param changes - The partial session data to merge.
 */
export function updateViewSession(
  viewAreaId: string,
  sessionId: string,
  changes: Partial<Omit<ViewSession, 'id'>>,
): void {
  const { sessions } = getViewSessionSet(viewAreaId);

  // Nothing to do when the session does not exist
  if (!sessions.some((session) => session.id === sessionId)) {
    return;
  }

  // Merge the changes onto the matching session, leaving the others
  // untouched.
  updateViewSessionSet(viewAreaId, {
    sessions: sessions.map((session) =>
      session.id === sessionId ? { ...session, ...changes } : session,
    ),
  });
}
