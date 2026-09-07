import { DefaultSplitRatio } from '../../constants';
import { ViewSession } from '../../types';
import { dispatchViewArea } from '../dispatchViewArea';
import { getActiveViewSession } from '../getActiveViewSession';
import { getViewSessionSet } from '../getViewSessionSet';
import { pruneHistoryEntries } from '../pruneHistoryEntries';
import { updateViewSessionSet } from '../updateViewSessionSet';
import { viewMatches } from '../viewMatches';

/**
 * Closes the view with the given instance id across the view area's
 * sessions. Sessions showing it in the main pane are closed, sessions
 * showing it in the split have the split cleared, and the view is
 * pruned out of the surviving sessions' history stacks.
 *
 * @param viewAreaId - The id of the view area.
 * @param viewId - The instance id of the view to close.
 *
 * @dispatches app:view-area:set
 */
export function closeViewSessionsForView(
  viewAreaId: string,
  viewId: string,
): void {
  const { sessions, activeSessionId } = getViewSessionSet(viewAreaId);

  // Remember the active session's position to pick a neighbour later
  const activeIndex = sessions.findIndex(
    (session) => session.id === activeSessionId,
  );
  let changed = false;

  // Build the next sessions list, dropping or clearing matching views
  const nextSessions: ViewSession[] = [];

  sessions.forEach((session) => {
    // The main view matches, drop the whole session
    if (viewMatches(session.main, viewId)) {
      changed = true;

      return;
    }

    // Prune the closed view out of the session's history stacks
    const currentBackHistory = session.backHistory ?? [];
    const currentForwardHistory = session.forwardHistory ?? [];
    const backHistory = pruneHistoryEntries(currentBackHistory, viewId);
    const forwardHistory = pruneHistoryEntries(currentForwardHistory, viewId);

    // Whether either stack was actually pruned
    const historyChanged =
      backHistory !== currentBackHistory ||
      forwardHistory !== currentForwardHistory;

    // Only the split matches, clear it and reset the split ratio
    if (viewMatches(session.split, viewId)) {
      changed = true;
      nextSessions.push({
        ...session,
        split: null,
        splitRatio: DefaultSplitRatio,
        backHistory,
        forwardHistory,
      });

      return;
    }

    // Neither pane matched, but the view was pruned from the history
    if (historyChanged) {
      changed = true;
      nextSessions.push({ ...session, backHistory, forwardHistory });

      return;
    }

    // Nothing matched at all, keep the session as-is
    nextSessions.push(session);
  });

  // Nothing to store when no session matched
  if (!changed) {
    return;
  }

  // The active session was dropped, so activate a neighbour at its
  // old position.
  if (!nextSessions.some((session) => session.id === activeSessionId)) {
    const neighbour =
      nextSessions[Math.min(activeIndex, nextSessions.length - 1)] ?? null;

    // Store the remaining sessions and the new active session
    updateViewSessionSet(viewAreaId, {
      sessions: nextSessions,
      activeSessionId: neighbour?.id ?? null,
    });

    // Show the newly active session's content
    dispatchViewArea(viewAreaId, neighbour);

    return;
  }

  // The active session survived, so store the sessions and re-sync
  // its content in case its split was cleared.
  updateViewSessionSet(viewAreaId, { sessions: nextSessions });
  dispatchViewArea(viewAreaId, getActiveViewSession(viewAreaId));
}
