import { MaxHistoryLength } from '../../constants';
import { dispatchViewArea } from '../dispatchViewArea';
import { getActiveViewSession } from '../getActiveViewSession';
import { getViewSessionSet } from '../getViewSessionSet';
import { toHistoryEntry } from '../toHistoryEntry';
import { updateViewSessionSet } from '../updateViewSessionSet';

/**
 * Navigates the view area's active session back through its history.
 * Does nothing when there is no history to go back to.
 *
 * @param viewAreaId - The id of the view area.
 * @param steps - How many entries to navigate back through, clamped to the available history.
 *
 * @dispatches app:view-area:set
 */
export function goBack(viewAreaId: string, steps = 1): void {
  const session = getActiveViewSession(viewAreaId);
  const backHistory = session?.backHistory ?? [];

  // Nothing to navigate without a session or back history
  if (!session || !backHistory.length) {
    return;
  }

  // Clamp the requested steps to the available history
  const stepCount = Math.min(Math.max(steps, 1), backHistory.length);

  // The index of the entry whose state is restored
  const entryIndex = backHistory.length - stepCount;
  const entry = backHistory[entryIndex];

  // The entries navigated past, ordered nearest to the restored entry
  // last so they are navigated forward through in reverse.
  const skipped = backHistory.slice(entryIndex + 1).reverse();

  // Restore the entry's state onto the session, moving the current
  // state and the entries navigated past onto the forward history.
  const updatedSession = {
    ...session,
    main: entry.main,
    split: entry.split,
    splitRatio: entry.splitRatio,
    viewState: entry.viewState ?? {},
    slots: entry.slots ?? {},
    backHistory: backHistory.slice(0, entryIndex),
    forwardHistory: [
      ...(session.forwardHistory ?? []),
      toHistoryEntry(session),
      ...skipped,
    ].slice(-MaxHistoryLength),
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
