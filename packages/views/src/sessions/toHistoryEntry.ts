import { SessionHistoryEntry, ViewSession } from '../types';

/**
 * Snapshots a session's current view area state as a history entry.
 *
 * @param session - The session to snapshot.
 */
export function toHistoryEntry(session: ViewSession): SessionHistoryEntry {
  // Capture the panes, split ratio and transient state, leaving out
  // the session's identity and slot claims.
  return {
    main: session.main,
    split: session.split,
    splitRatio: session.splitRatio,
    viewState: session.viewState,
  };
}
