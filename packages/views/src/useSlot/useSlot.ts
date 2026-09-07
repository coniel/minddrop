import { useEffect } from 'react';
import { useViewPane } from '../ViewPaneContext';
import { useViewSession } from '../ViewSessionContext';
import { DefaultViewAreaId } from '../constants';
import { initializeSlot } from '../sessions/initializeSlot';
import { SessionSlot, SlotFillKind } from '../types';

/**
 * Sets the calling view's default state for a shell slot: the fill to
 * render in it and whether it starts hidden. Applied once on mount,
 * and only when the view's session holds no state for the slot yet,
 * so state restored from the history or set by an event wins. Does
 * nothing outside of a view session.
 *
 * @param slotId - The id of the slot to fill.
 * @param state - The slot's default state. Props are plain data only, since the state persists with the session.
 */
export function useSlot(slotId: SlotFillKind, state: SessionSlot): void {
  const pane = useViewPane();
  const sessionId = useViewSession();
  const viewAreaId = pane?.viewAreaId ?? DefaultViewAreaId;

  // Compared by value so unstable but equal state objects do not
  // re-run the effect on every render.
  const stateJson = JSON.stringify(state);

  useEffect(() => {
    // Nothing to fill outside of a session
    if (!sessionId) {
      return;
    }

    initializeSlot(viewAreaId, sessionId, slotId, JSON.parse(stateJson));
  }, [viewAreaId, sessionId, slotId, stateJson]);
}
