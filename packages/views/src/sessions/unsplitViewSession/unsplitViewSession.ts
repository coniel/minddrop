import { DefaultSplitRatio } from '../../constants';
import { dispatchViewArea } from '../dispatchViewArea';
import { generateBlankViewSession } from '../generateBlankViewSession';
import { getViewSessionSet } from '../getViewSessionSet';
import { updateViewSessionSet } from '../updateViewSessionSet';

/**
 * Closes the split pane of the session with the given id, moving its
 * view into a new session positioned after it.
 *
 * @param viewAreaId - The id of the view area.
 * @param sessionId - The id of the session to unsplit.
 *
 * @dispatches app:view-area:set
 */
export function unsplitViewSession(
  viewAreaId: string,
  sessionId: string,
): void {
  const { sessions, activeSessionId } = getViewSessionSet(viewAreaId);

  // Find the session to unsplit
  const index = sessions.findIndex((session) => session.id === sessionId);
  const session = sessions[index];

  // Nothing to do when the session does not exist or is not split
  if (!session?.split) {
    return;
  }

  // Drop the split pane, resetting the pane widths
  const nextSession = {
    ...session,
    split: null,
    splitRatio: DefaultSplitRatio,
  };

  // Move the split pane's view and transient state into a new session
  const splitPaneSession = {
    ...generateBlankViewSession(),
    main: session.split,
    viewState: { main: session.viewState?.split },
  };

  // Store the unsplit session followed by the split pane's session
  updateViewSessionSet(viewAreaId, {
    sessions: [
      ...sessions.slice(0, index),
      nextSession,
      splitPaneSession,
      ...sessions.slice(index + 1),
    ],
  });

  // Show the unsplit content when the session is the active one
  if (activeSessionId === sessionId) {
    dispatchViewArea(viewAreaId, nextSession);
  }
}
