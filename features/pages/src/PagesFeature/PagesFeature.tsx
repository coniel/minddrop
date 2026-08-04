import { useEffect } from 'react';
import {
  CloseViewEvent,
  CloseViewEventData,
  Events,
  OpenViewEvent,
  OpenViewEventData,
  UpdateViewEvent,
  UpdateViewEventData,
} from '@minddrop/events';
import { Tabs } from '@minddrop/feature-views';
import {
  PageDeletedEvent,
  PageDeletedEventData,
  PageUpdatedEvent,
  PageUpdatedEventData,
  Pages,
} from '@minddrop/pages';
import { NewPageDialog } from '../NewPageDialog';
import { PageViewProps } from '../PageView';
import { PageViewStateStore } from '../PageViewStateStore';
import {
  EventListenerId,
  OpenPageViewEvent,
  OpenPageViewEventData,
  PageViewName,
} from '../events';

// Unique view instance id used to match page views in tabs
const pageViewId = (pageId: string) => `pages:page:${pageId}`;

/**
 * Renders the pages feature dialogs and registers event listeners
 * for opening, updating, and closing page views.
 */
export const PagesFeature: React.FC = () => {
  useEffect(() => {
    // Close restored page views whose page no longer exists
    // (e.g. deleted externally while the app was closed)
    Tabs.getOpenTabs(PageViewName).forEach((tabView) => {
      const props = tabView.props as PageViewProps | undefined;

      // Skip views without a page ID
      if (!props?.pageId) {
        return;
      }

      // Skip views whose page resolves
      if (Pages.get(props.pageId, false)) {
        return;
      }

      // Close the view
      Events.dispatch<CloseViewEventData>(CloseViewEvent, {
        id: tabView.id ?? pageViewId(props.pageId),
      });
    });

    // Listen for open page view events, and open the page view
    // when one is received
    Events.addListener<OpenPageViewEventData>(
      OpenPageViewEvent,
      EventListenerId,
      ({ data }) => {
        const page = Pages.get(data.pageId, false);

        Events.dispatch<OpenViewEventData<PageViewProps>>(OpenViewEvent, {
          view: PageViewName,
          id: pageViewId(data.pageId),
          props: { pageId: data.pageId },
          title: page?.name,
          icon: page?.icon,
        });
      },
    );

    // Update the page's open view when the page changes
    // (e.g. renamed or re-iconed)
    Events.addListener<PageUpdatedEventData>(
      PageUpdatedEvent,
      EventListenerId,
      ({ data }) => {
        Events.dispatch<UpdateViewEventData>(UpdateViewEvent, {
          id: pageViewId(data.updated.id),
          title: data.updated.name,
          icon: data.updated.icon,
        });
      },
    );

    // Close the page's open view and drop its view state when
    // the page is deleted
    Events.addListener<PageDeletedEventData>(
      PageDeletedEvent,
      EventListenerId,
      ({ data }) => {
        PageViewStateStore.remove(data.id);

        Events.dispatch<CloseViewEventData>(CloseViewEvent, {
          id: pageViewId(data.id),
        });
      },
    );

    return () => {
      Events.removeListener(OpenPageViewEvent, EventListenerId);
      Events.removeListener(PageUpdatedEvent, EventListenerId);
      Events.removeListener(PageDeletedEvent, EventListenerId);
    };
  }, []);

  return <NewPageDialog />;
};
