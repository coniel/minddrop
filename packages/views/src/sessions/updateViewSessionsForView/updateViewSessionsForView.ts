import { SessionHistoryEntry } from '../../types';
import { ViewUpdateChanges, applyViewUpdate } from '../applyViewUpdate';
import { dispatchViewArea } from '../dispatchViewArea';
import { getActiveViewSession } from '../getActiveViewSession';
import { getViewSessionSet } from '../getViewSessionSet';
import { updateViewSessionSet } from '../updateViewSessionSet';

/**
 * Updates the view with the given instance id across the view area's
 * sessions (e.g. after a rename), setting its new id, props, title
 * and icon. History entries showing the view are patched as well so
 * they don't go stale.
 *
 * @param viewAreaId - The id of the view area.
 * @param viewId - The instance id of the view to update.
 * @param changes - The new id, props (merged), title and icon.
 *
 * @dispatches app:view-area:set
 */
export function updateViewSessionsForView(
  viewAreaId: string,
  viewId: string,
  changes: ViewUpdateChanges,
): void {
  const { sessions, activeSessionId } = getViewSessionSet(viewAreaId);

  // Whether any session changed, and whether the active session was
  // among them.
  let changed = false;
  let activeChanged = false;

  // Apply the changes to every session's matching main and split view
  const nextSessions = sessions.map((session) => {
    const main = applyViewUpdate(session.main, viewId, changes);
    const split = applyViewUpdate(session.split, viewId, changes);

    // Patch matching entries in the session's history stacks
    const backHistory = patchHistoryEntries(
      session.backHistory,
      viewId,
      changes,
    );
    const forwardHistory = patchHistoryEntries(
      session.forwardHistory,
      viewId,
      changes,
    );

    // Leave the session untouched when nothing matched
    if (
      main === session.main &&
      split === session.split &&
      backHistory === session.backHistory &&
      forwardHistory === session.forwardHistory
    ) {
      return session;
    }

    changed = true;

    // Track when the active session's views changed so its content can
    // re-render, ignoring history-only patches.
    if (
      session.id === activeSessionId &&
      (main !== session.main || split !== session.split)
    ) {
      activeChanged = true;
    }

    // Return the session with its updated views and history
    return { ...session, main, split, backHistory, forwardHistory };
  });

  // Nothing to store when no session matched
  if (!changed) {
    return;
  }

  // Store the updated sessions
  updateViewSessionSet(viewAreaId, { sessions: nextSessions });

  // Re-render the active view when its props changed (e.g. a new id)
  if (activeChanged) {
    dispatchViewArea(viewAreaId, getActiveViewSession(viewAreaId));
  }
}

/**
 * Returns the history entries with the changes applied to entries
 * showing the updated view, or the original array unchanged when no
 * entry matches.
 */
function patchHistoryEntries(
  entries: SessionHistoryEntry[] | undefined,
  viewId: string,
  changes: ViewUpdateChanges,
): SessionHistoryEntry[] | undefined {
  // Nothing to patch without any entries
  if (!entries) {
    return entries;
  }

  // Track whether any entry actually changed
  let changed = false;

  // Apply the changes to each entry's panes
  const patched = entries.map((entry) => {
    const main = applyViewUpdate(entry.main, viewId, changes);
    const split = applyViewUpdate(entry.split, viewId, changes);

    // Leave the entry untouched when neither pane matched
    if (main === entry.main && split === entry.split) {
      return entry;
    }

    changed = true;

    return { ...entry, main, split };
  });

  // Keep the original array's identity when nothing matched
  return changed ? patched : entries;
}
