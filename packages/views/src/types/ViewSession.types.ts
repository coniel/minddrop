import { EntityId } from '@minddrop/utils';
import { SessionHistoryEntry } from './SessionHistoryEntry.types';
import { SessionView } from './SessionView.types';
import { SessionViewState } from './SessionViewState.types';
import { SlotClaim } from './SlotClaim.types';

export type ViewSessionId = EntityId<'session'>;

/**
 * A navigable surface with a history: the panes it shows, their
 * split, the states navigated through and the panes' transient UI
 * state. A view area lists its sessions (e.g. as tabs) and shows the
 * active one.
 */
export interface ViewSession {
  /**
   * Unique identifier for the session.
   */
  id: ViewSessionId;

  /**
   * The view shown in the main (left) pane, or null when the session
   * is blank.
   */
  main: SessionView | null;

  /**
   * The view shown in the split (right) pane, or null when the
   * session has no split.
   */
  split: SessionView | null;

  /**
   * The width of the main (left) pane as a percentage (0-100).
   */
  splitRatio: number;

  /**
   * Previously shown view area states, nearest last, restored by
   * navigating back.
   */
  backHistory?: SessionHistoryEntry[];

  /**
   * View area states navigated back from, nearest last, restored by
   * navigating forward.
   */
  forwardHistory?: SessionHistoryEntry[];

  /**
   * The panes' transient UI state for the currently shown views. When
   * a pane navigates to a different view, its state is snapshotted
   * into the pushed history entry and starts fresh for the new view.
   */
  viewState?: SessionViewState;

  /**
   * The shell slots claimed by the session's mounted views, keyed by
   * slot id. Claims are not part of the history: navigating away
   * unmounts the claimant, which releases its claim.
   */
  slots?: Record<string, SlotClaim>;
}
