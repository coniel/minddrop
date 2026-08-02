import { useEffect } from 'react';
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
import { Tabs } from '../Tabs';

const LISTENER_ID = 'desktop-app:tabs';

/**
 * Renders nothing. Keeps the active tab in sync with the main content
 * area and restores the active tab's content on startup.
 */
export const TabsFeature: React.FC = () => {
  useEffect(() => {
    // Record main content changes onto the active tab
    Events.addListener<MainContentChangedEventData>(
      MainContentChangedEvent,
      LISTENER_ID,
      ({ data }) => {
        Tabs.recordMainContent(data);
      },
    );

    // Update tabs when a view's metadata changes (e.g. a rename)
    Events.addListener<UpdateMainContentViewEventData>(
      UpdateMainContentViewEvent,
      LISTENER_ID,
      ({ data }) => {
        Tabs.updateTabsForView(data.id, {
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
      LISTENER_ID,
      ({ data }) => {
        Tabs.closeTabsForView(data.id);
      },
    );

    // Restore the active tab's content once the main content area is
    // ready to receive it (covers MainContent mounting after this).
    Events.addListener(MainContentReadyEvent, LISTENER_ID, () => {
      Tabs.restoreActiveTab();
    });

    // Fallback for the reverse order, where MainContent is already
    // mounted and listening before this feature runs.
    queueMicrotask(() => {
      Tabs.restoreActiveTab();
    });

    return () => {
      Events.removeListener(MainContentChangedEvent, LISTENER_ID);
      Events.removeListener(UpdateMainContentViewEvent, LISTENER_ID);
      Events.removeListener(CloseMainContentViewEvent, LISTENER_ID);
      Events.removeListener(MainContentReadyEvent, LISTENER_ID);
    };
  }, []);

  return null;
};
