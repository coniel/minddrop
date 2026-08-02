import {
  Events,
  SetMainContentEvent,
  SetMainContentEventData,
} from '@minddrop/events';
import { Tab } from './TabSetsStore';
import { toSetMainContentEventData } from './toSetMainContentEventData';

/**
 * Dispatches a tab's content as the main content state.
 *
 * @param tab - The tab to dispatch, or null to clear the main content.
 *
 * @dispatches app:main-content:set
 */
export function dispatchMainContent(tab: Tab | null): void {
  // Convert the tab to a main content state and dispatch it
  Events.dispatch<SetMainContentEventData>(
    SetMainContentEvent,
    toSetMainContentEventData(tab),
  );
}
