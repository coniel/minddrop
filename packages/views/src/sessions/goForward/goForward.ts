import { MaxHistoryLength } from '../../constants';
import { dispatchViewArea } from '../dispatchViewArea';
import { getActiveViewSession } from '../getActiveViewSession';
import { getViewSessionSet } from '../getViewSessionSet';
import { toHistoryEntry } from '../toHistoryEntry';
import { updateViewSessionSet } from '../updateViewSessionSet';

/**
 * Navigates the view area's active session forward to the state it
 * last navigated back from. Does nothing when there is no history to
 * go forward to.
 *
 * @param viewAreaId - The id of the view area.
 *
 * @dispatches app:view-area:set
 */
export function goForward(viewAreaId: string): void {
  const session = getActiveViewSession(viewAreaId);
  const forwardHistory = session?.forwardHistory ?? [];

  // Nothing to navigate without a session or forward history
  if (!session || !forwardHistory.length) {
    return;
  }

  // Take the nearest entry as the state to restore
  const entry = forwardHistory[forwardHistory.length - 1];

  // Restore the entry's state onto the session, moving the current
  // state onto the back history.
  const updatedSession = {
    ...session,
    main: entry.main,
    split: entry.split,
    splitRatio: entry.splitRatio,
    viewState: entry.viewState ?? {},
    backHistory: [
      ...(session.backHistory ?? []),
      toHistoryEntry(session),
    ].slice(-MaxHistoryLength),
    forwardHistory: forwardHistory.slice(0, -1),
  };

  // Store the updated session back into its view area
  const { sessions } = getViewSessionSet(viewAreaId);

  updateViewSessionSet(viewAreaId, {
    sessions: sessions.map((setSession) =>
      setSession.id === session.id ? updatedSession : setSession,
    ),
  });

  // Show the restored state in the view area
  dispatchViewArea(viewAreaId, updatedSession);
}
