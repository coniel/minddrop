import {
  Events,
  SetViewAreaEvent,
  SetViewAreaEventData,
} from '@minddrop/events';
import { Tab } from './TabSetsStore';
import { toSetViewAreaEventData } from './toSetViewAreaEventData';

/**
 * Dispatches a tab's content as the view area's state.
 *
 * @param viewAreaId - The id of the view area to update.
 * @param tab - The tab to dispatch, or null to clear the view area.
 *
 * @dispatches app:view-area:set
 */
export function dispatchViewArea(viewAreaId: string, tab: Tab | null): void {
  // Convert the tab to a view area state and dispatch it
  Events.dispatch<SetViewAreaEventData>(
    SetViewAreaEvent,
    toSetViewAreaEventData(viewAreaId, tab),
  );
}
