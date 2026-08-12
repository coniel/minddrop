import { useEffect } from 'react';
import { Events, OpenViewEvent, OpenViewEventData } from '@minddrop/events';
import {
  DesignStudioEventListenerId,
  DesignStudioViewName,
  OpenDesignStudioEvent,
  OpenDesignStudioEventData,
} from './events';

/**
 * Renders nothing — bootstraps the design studio feature by
 * registering event listeners.
 */
export const DesignsFeature: React.FC = () => {
  useEffect(() => {
    // Track the current main content view so we can provide
    // back navigation when the design studio is opened without
    // an explicit back event.
    let currentView: OpenViewEventData | null = null;

    Events.addListener<OpenViewEventData>(
      OpenViewEvent,
      `${DesignStudioEventListenerId}:view-tracker`,
      ({ data }) => {
        // Don't track the design studio view as the "current view"
        if (data.view !== DesignStudioViewName) {
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
          eventData.backEvent = OpenViewEvent;
          eventData.backEventData = currentView;
        }

        Events.dispatch<OpenViewEventData<OpenDesignStudioEventData>>(
          OpenViewEvent,
          {
            view: DesignStudioViewName,
            props: eventData,
          },
        );
      },
    );

    return () => {
      Events.removeListener(OpenDesignStudioEvent, DesignStudioEventListenerId);
      Events.removeListener(
        OpenViewEvent,
        `${DesignStudioEventListenerId}:view-tracker`,
      );
    };
  }, []);

  return null;
};
