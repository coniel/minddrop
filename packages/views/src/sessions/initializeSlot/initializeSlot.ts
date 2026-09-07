import { SessionSlot } from '../../types';
import { getViewSession } from '../getViewSession';
import { setSlot } from '../setSlot';

/**
 * Sets a session's default state for a shell slot, applied only when
 * the session holds no state for it yet. Does nothing when the
 * session does not exist or already has the slot in some state (e.g.
 * restored from its history or changed by an event).
 *
 * @param viewAreaId - The id of the view area.
 * @param sessionId - The id of the session filling the slot.
 * @param slotId - The id of the slot to initialize.
 * @param state - The slot's default state.
 */
export function initializeSlot(
  viewAreaId: string,
  sessionId: string,
  slotId: string,
  state: SessionSlot,
): void {
  const session = getViewSession(viewAreaId, sessionId);

  // Nothing to do when the session already holds the slot's state
  if (session?.slots?.[slotId]) {
    return;
  }

  setSlot(viewAreaId, sessionId, slotId, state);
}
