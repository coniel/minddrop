import { SessionView } from '../../types';
import { dispatchViewArea } from '../dispatchViewArea';
import { getViewSessionSet } from '../getViewSessionSet';
import { updateViewSessionSet } from '../updateViewSessionSet';

/**
 * Opens the given view in the split pane of the session with the
 * given id, making the session active.
 *
 * @param viewAreaId - The id of the view area.
 * @param sessionId - The id of the session to split.
 * @param view - The view to show in the split pane.
 *
 * @dispatches app:view-area:set
 */
export function splitViewSession(
  viewAreaId: string,
  sessionId: string,
  view: SessionView,
): void {
  const { sessions } = getViewSessionSet(viewAreaId);

  // Find the session to split
  const session = sessions.find(
    (currentSession) => currentSession.id === sessionId,
  );

  // Nothing to do when the session does not exist
  if (!session) {
    return;
  }

  // Add the view to the session's split pane
  const nextSession = { ...session, split: view };

  // Store the updated session and make it active
  updateViewSessionSet(viewAreaId, {
    sessions: sessions.map((currentSession) =>
      currentSession.id === sessionId ? nextSession : currentSession,
    ),
    activeSessionId: sessionId,
  });

  // Show the split session's content
  dispatchViewArea(viewAreaId, nextSession);
}
