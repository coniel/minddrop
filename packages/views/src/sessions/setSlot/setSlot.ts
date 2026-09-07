import { SessionSlot } from '../../types';
import { getViewSession } from '../getViewSession';
import { updateViewSession } from '../updateViewSession';

/**
 * Merges the given state onto a session's state for a shell slot,
 * setting the fill rendered in it or its visibility. Does nothing
 * when the session does not exist or already holds the same state.
 *
 * @param viewAreaId - The id of the view area.
 * @param sessionId - The id of the session filling the slot.
 * @param slotId - The id of the slot to set.
 * @param state - The slot state to merge onto the session's current one.
 */
export function setSlot(
  viewAreaId: string,
  sessionId: string,
  slotId: string,
  state: SessionSlot,
): void {
  // Find the session filling the slot
  const session = getViewSession(viewAreaId, sessionId);

  // Nothing to do when the session does not exist
  if (!session) {
    return;
  }

  // Merge the state onto the slot's current one, so a hide leaves the
  // chosen fill in place and a swap leaves the visibility alone.
  const slot = { ...session.slots?.[slotId], ...state };

  // Leave the session untouched when the slot already holds the state,
  // so re-sets with unstable but equal props do not churn persistence.
  if (JSON.stringify(session.slots?.[slotId]) === JSON.stringify(slot)) {
    return;
  }

  // Store the slot state onto the session
  updateViewSession(viewAreaId, sessionId, {
    slots: { ...session.slots, [slotId]: slot },
  });
}
