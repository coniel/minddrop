import {
  CloseMainContentViewEvent,
  CloseMainContentViewEventData,
  Events,
  MainContentChangedEvent,
  MainContentChangedEventData,
  MainContentReadyEvent,
  UpdateMainContentViewEvent,
  UpdateMainContentViewEventData,
} from '@minddrop/events';
import { closeTabsForView } from '../closeTabsForView';
import { recordMainContent } from '../recordMainContent';
import { restoreActiveTab } from '../restoreActiveTab';
import { updateTabsForView } from '../updateTabsForView';

/**
 * Keeps the set's active tab in sync with the main content area and
 * restores its content once the main content area is ready. Returns a
 * cleanup which removes the listeners.
 *
 * @param setId - The id of the tab set to sync.
 */
export function initializeTabsSyncListeners(setId: string): VoidFunction {
  const listenerId = `feature-views:tabs:${setId}`;

  // Record main content changes onto the active tab
  Events.addListener<MainContentChangedEventData>(
    MainContentChangedEvent,
    listenerId,
    ({ data }) => {
      recordMainContent(setId, data);
    },
  );

  // Update tabs when a view's metadata changes (e.g. a rename)
  Events.addListener<UpdateMainContentViewEventData>(
    UpdateMainContentViewEvent,
    listenerId,
    ({ data }) => {
      updateTabsForView(setId, data.id, {
        id: data.newId,
        props: data.props,
        title: data.title,
        icon: data.icon,
      });
    },
  );

  // Close tabs when their view is closed (e.g. a delete)
  Events.addListener<CloseMainContentViewEventData>(
    CloseMainContentViewEvent,
    listenerId,
    ({ data }) => {
      closeTabsForView(setId, data.id);
    },
  );

  // Restore the active tab's content once the main content area is
  // ready to receive it (covers the main content area mounting after
  // this)
  Events.addListener(MainContentReadyEvent, listenerId, () => {
    restoreActiveTab(setId);
  });

  // Fallback for the reverse order, where the main content area is
  // already mounted and listening before this runs
  queueMicrotask(() => {
    restoreActiveTab(setId);
  });

  return () => {
    Events.removeListener(MainContentChangedEvent, listenerId);
    Events.removeListener(UpdateMainContentViewEvent, listenerId);
    Events.removeListener(CloseMainContentViewEvent, listenerId);
    Events.removeListener(MainContentReadyEvent, listenerId);
  };
}
