import { getViewSession } from '../getViewSession';
import { updateViewSession } from '../updateViewSession';

/**
 * Releases a shell slot claimed by the given session. Does nothing
 * when the session does not exist or holds no claim on the slot.
 *
 * @param viewAreaId - The id of the view area.
 * @param sessionId - The id of the session releasing the slot.
 * @param slotId - The id of the slot to release.
 */
export function releaseSlot(
  viewAreaId: string,
  sessionId: string,
  slotId: string,
): void {
  // Find the session releasing the slot
  const session = getViewSession(viewAreaId, sessionId);

  // Nothing to do when the session holds no claim on the slot
  if (!session?.slots?.[slotId]) {
    return;
  }

  // Drop the claim from the session's slots
  const { [slotId]: released, ...slots } = session.slots;

  updateViewSession(viewAreaId, sessionId, { slots });
}
