import { SlotClaim } from '../../types';
import { getViewSession } from '../getViewSession';
import { updateViewSession } from '../updateViewSession';

/**
 * Claims a shell slot for the given session, naming the fill rendered
 * in it while the session is active. Does nothing when the session
 * does not exist or already holds an equal claim.
 *
 * @param viewAreaId - The id of the view area.
 * @param sessionId - The id of the session claiming the slot.
 * @param slotId - The id of the slot to claim.
 * @param claim - The fill to render in the slot, and its props.
 */
export function claimSlot(
  viewAreaId: string,
  sessionId: string,
  slotId: string,
  claim: SlotClaim,
): void {
  // Find the session claiming the slot
  const session = getViewSession(viewAreaId, sessionId);

  // Nothing to do when the session does not exist
  if (!session) {
    return;
  }

  // Leave the session untouched when it already holds the claim, so
  // re-claims with unstable but equal props do not churn persistence.
  if (JSON.stringify(session.slots?.[slotId]) === JSON.stringify(claim)) {
    return;
  }

  // Store the claim onto the session
  updateViewSession(viewAreaId, sessionId, {
    slots: { ...session.slots, [slotId]: claim },
  });
}
