import { getViewSession } from '../getViewSession';
import { setSlot } from '../setSlot';

/**
 * Flips whether a shell slot is hidden for the given session, keeping
 * its fill so showing it again brings the same one back. Does nothing
 * when the session does not exist.
 *
 * @param viewAreaId - The id of the view area.
 * @param sessionId - The id of the session filling the slot.
 * @param slotId - The id of the slot to toggle.
 */
export function toggleSlot(
  viewAreaId: string,
  sessionId: string,
  slotId: string,
): void {
  const session = getViewSession(viewAreaId, sessionId);

  // A slot without state is shown, so toggling it hides it
  const hidden = session?.slots?.[slotId]?.hidden ?? false;

  setSlot(viewAreaId, sessionId, slotId, { hidden: !hidden });
}
