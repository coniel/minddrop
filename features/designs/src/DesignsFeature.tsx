import { useEffect } from 'react';
import {
  Events,
  OpenMainContentViewEvent,
  OpenMainContentViewEventData,
} from '@minddrop/events';
import { DesignBrowser, DesignBrowserProps } from './DesignBrowser';
import { DesignPropertyMappingStore } from './DesignPropertyMappingStore';
import { DesignStudio } from './DesignStudio';
import {
  BrowseDesignsEvent,
  BrowseDesignsEventData,
  DesignPropertyMappingEventListenerId,
  DesignStudioEventListenerId,
  OpenDesignStudioEvent,
  OpenDesignStudioEventData,
  OpenPropertyMapperEvent,
  OpenPropertyMapperEventData,
} from './events';

/**
 * Renders nothing — bootstraps design studio and design property
 * mapping features by registering event listeners.
 */
export const DesignsFeature: React.FC = () => {
  useEffect(() => {
    // Track the current main content view so we can provide
    // back navigation when the design studio or design browser
    // is opened without an explicit back event.
    let currentView: OpenMainContentViewEventData | null = null;

    Events.addListener<OpenMainContentViewEventData>(
      OpenMainContentViewEvent,
      `${DesignStudioEventListenerId}:view-tracker`,
      ({ data }) => {
        // Don't track design studio or design browser views
        // as the "current view"
        if (
          data.component !== DesignStudio &&
          data.component !== DesignBrowser
        ) {
          currentView = data;
        }
      },
    );

    // -- Design Studio listeners --

    // Listen for design studio open events and open the design
    // studio when one is received.
    Events.addListener<OpenDesignStudioEventData>(
      OpenDesignStudioEvent,
      DesignStudioEventListenerId,
      ({ data }) => {
        // If no back event was provided but there is a tracked
        // current view, set it as the back target.
        const eventData = { ...data };

        if (!eventData.backEvent && currentView) {
          eventData.backEvent = OpenMainContentViewEvent;
          eventData.backEventData = currentView;
        }

        Events.dispatch<
          OpenMainContentViewEventData<OpenDesignStudioEventData>
        >(OpenMainContentViewEvent, {
          component: DesignStudio,
          props: eventData,
        });
      },
    );

    // -- Design Property Mapping listeners --

    // Listen for browse designs events and open the design browser
    // as the main content view
    Events.addListener<BrowseDesignsEventData>(
      BrowseDesignsEvent,
      `${DesignPropertyMappingEventListenerId}:browse`,
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
      `${DesignPropertyMappingEventListenerId}:mapper`,
      () => {
        // TODO: open property mapper as main content view
      },
    );

    return () => {
      // Design studio cleanup
      Events.removeListener(OpenDesignStudioEvent, DesignStudioEventListenerId);
      Events.removeListener(
        OpenMainContentViewEvent,
        `${DesignStudioEventListenerId}:view-tracker`,
      );

      // Design property mapping cleanup
      DesignPropertyMappingStore.getState().clear();
      Events.removeListener(
        BrowseDesignsEvent,
        `${DesignPropertyMappingEventListenerId}:browse`,
      );
      Events.removeListener(
        OpenPropertyMapperEvent,
        `${DesignPropertyMappingEventListenerId}:mapper`,
      );
    };
  }, []);

  return null;
};
