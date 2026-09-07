import { useEffect } from 'react';
import { SlotFillKind, ViewSessions, Views } from '@minddrop/views';

/**
 * Claims a shell slot for the calling view's session while mounted,
 * naming the fill to render in it, and releases the claim on unmount.
 * Does nothing outside of a view session.
 *
 * @param slotId - The id of the slot to claim.
 * @param fillId - The id of the registered fill to render in the slot.
 * @param props - Props passed to the fill. Plain data only, since the claim persists with the session.
 */
export function useSlot(
  slotId: SlotFillKind,
  fillId: string,
  props?: Record<string, unknown>,
): void {
  const pane = Views.useViewPane();
  const sessionId = Views.useSession();
  const viewAreaId = pane?.viewAreaId ?? Views.constants.DefaultAreaId;

  // Compared by value so unstable but equal prop objects do not
  // re-claim the slot on every render.
  const propsJson = JSON.stringify(props);

  useEffect(() => {
    // Nothing to claim outside of a session
    if (!sessionId) {
      return;
    }

    ViewSessions.claimSlot(viewAreaId, sessionId, slotId, {
      fill: fillId,
      props: propsJson ? JSON.parse(propsJson) : undefined,
    });

    return () => {
      ViewSessions.releaseSlot(viewAreaId, sessionId, slotId);
    };
  }, [viewAreaId, sessionId, slotId, fillId, propsJson]);
}
