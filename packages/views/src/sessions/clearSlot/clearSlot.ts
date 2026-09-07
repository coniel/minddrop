import { getViewSession } from '../getViewSession';
import { updateViewSession } from '../updateViewSession';

/**
 * Removes a session's state for a shell slot, returning the slot to
 * the shell's fallback. Does nothing when the session does not exist
 * or holds no state for the slot.
 *
 * @param viewAreaId - The id of the view area.
 * @param sessionId - The id of the session filling the slot.
 * @param slotId - The id of the slot to clear.
 */
export function clearSlot(
  viewAreaId: string,
  sessionId: string,
  slotId: string,
): void {
  // Find the session filling the slot
  const session = getViewSession(viewAreaId, sessionId);

  // Nothing to do when the session holds no state for the slot
  if (!session?.slots?.[slotId]) {
    return;
  }

  // Drop the slot from the session's slots
  const { [slotId]: cleared, ...slots } = session.slots;

  updateViewSession(viewAreaId, sessionId, { slots });
}
