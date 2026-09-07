import { Events } from '@minddrop/events';
import { SetViewAreaEvent } from '../events';
import { ViewSession } from '../types';
import { toSetViewAreaEventData } from './toSetViewAreaEventData';

/**
 * Dispatches a session's content as the view area's state.
 *
 * @param viewAreaId - The id of the view area to update.
 * @param session - The session to dispatch, or null to clear the view area.
 *
 * @dispatches app:view-area:set
 */
export function dispatchViewArea(
  viewAreaId: string,
  session: ViewSession | null,
): void {
  // Convert the session to a view area state and dispatch it
  Events.dispatch(
    SetViewAreaEvent,
    toSetViewAreaEventData(viewAreaId, session),
  );
}
