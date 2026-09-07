import { SessionSlot } from './SessionSlot.types';
import { SessionView } from './SessionView.types';
import { SessionViewState } from './SessionViewState.types';

/**
 * A snapshot of a session's view area state, kept in its back and
 * forward history and restored by navigating to it.
 */
export interface SessionHistoryEntry {
  /**
   * The main pane view at the time of the snapshot, or null when
   * the session was blank.
   */
  main: SessionView | null;

  /**
   * The split pane view at the time of the snapshot, or null when
   * the session had no split.
   */
  split: SessionView | null;

  /**
   * The main pane width as a percentage at the time of the snapshot.
   */
  splitRatio: number;

  /**
   * The panes' transient UI state at the time of the snapshot.
   */
  viewState?: SessionViewState;

  /**
   * The state of the shell slots the session filled at the time of
   * the snapshot.
   */
  slots?: Record<string, SessionSlot>;
}
