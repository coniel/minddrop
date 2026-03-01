import { useEffect } from 'react';
import {
  Events,
  OpenMainContentViewEvent,
  OpenMainContentViewEventData,
} from '@minddrop/events';
import { DesignBrowser, DesignBrowserProps } from './DesignBrowser';
import { DesignPropertyMappingStore } from './DesignPropertyMappingStore';
import {
  BrowseDesignsEvent,
  BrowseDesignsEventData,
  EventListenerId,
  OpenPropertyMapperEvent,
  OpenPropertyMapperEventData,
} from './events';

export const DesignPropertyMappingFeature: React.FC = () => {
  useEffect(() => {
    // Track the current main content view so we can provide
    // back navigation when the design browser is opened.
    let currentView: OpenMainContentViewEventData | null = null;

    Events.addListener<OpenMainContentViewEventData>(
      OpenMainContentViewEvent,
      `${EventListenerId}:view-tracker`,
      ({ data }) => {
        // Don't track design browser views as the "current view"
        if (data.component !== DesignBrowser) {
          currentView = data;
        }
      },
    );

    // Listen for browse designs events and open the design browser
    // as the main content view
    Events.addListener<BrowseDesignsEventData>(
      BrowseDesignsEvent,
      `${EventListenerId}:browse`,
      (event) => {
        // Initialize the store with the database ID
        DesignPropertyMappingStore.getState().initialize(event.data.databaseId);

        Events.dispatch<OpenMainContentViewEventData<DesignBrowserProps>>(
          OpenMainContentViewEvent,
          {
            component: DesignBrowser,
            props: {
              ...event.data,
              backEvent: currentView ? OpenMainContentViewEvent : undefined,
              backEventData: currentView || undefined,
            },
          },
        );
      },
    );

    // Listen for mapper open events
    Events.addListener<OpenPropertyMapperEventData>(
      OpenPropertyMapperEvent,
      `${EventListenerId}:mapper`,
      () => {
        // TODO: open property mapper as main content view
      },
    );

    return () => {
      // Clear the store on cleanup
      DesignPropertyMappingStore.getState().clear();

      Events.removeListener(BrowseDesignsEvent, `${EventListenerId}:browse`);
      Events.removeListener(
        OpenPropertyMapperEvent,
        `${EventListenerId}:mapper`,
      );
      Events.removeListener(
        OpenMainContentViewEvent,
        `${EventListenerId}:view-tracker`,
      );
    };
  }, []);

  return null;
};
