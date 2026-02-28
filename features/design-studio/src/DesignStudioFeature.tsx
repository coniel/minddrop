import { useEffect } from 'react';
import {
  Events,
  OpenMainContentViewEvent,
  OpenMainContentViewEventData,
} from '@minddrop/events';
import { DesignStudio } from './components/DesignStudio';
import {
  EventListenerId,
  OpenDesignStudioEvent,
  OpenDesignStudioEventData,
} from './events';

export const DesignStudioFeature: React.FC = () => {
  useEffect(() => {
    // Track the current main content view so we can provide
    // back navigation when the design studio is opened without
    // an explicit back event (e.g. from the sidebar button).
    let currentView: OpenMainContentViewEventData | null = null;

    Events.addListener<OpenMainContentViewEventData>(
      OpenMainContentViewEvent,
      `${EventListenerId}:view-tracker`,
      ({ data }) => {
        // Don't track design studio views as the "current view"
        if (data.component !== DesignStudio) {
          currentView = data;
        }
      },
    );

    // Listen for design studio open events and open the design
    // studio when one is received.
    Events.addListener<OpenDesignStudioEventData>(
      OpenDesignStudioEvent,
      EventListenerId,
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

    return () => {
      Events.removeListener(OpenDesignStudioEvent, EventListenerId);
      Events.removeListener(
        OpenMainContentViewEvent,
        `${EventListenerId}:view-tracker`,
      );
    };
  }, []);

  return null;
};
