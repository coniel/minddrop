import { useEffect } from 'react';
import {
  Events,
  OpenMainContentViewEvent,
  OpenMainContentViewEventData,
} from '@minddrop/events';
import { useTranslation } from '@minddrop/i18n';
import {
  DesignStudioEventListenerId,
  DesignStudioViewName,
  OpenDesignStudioEvent,
  OpenDesignStudioEventData,
} from './events';

const DESIGN_STUDIO_ICON = 'content-icon:palette:default';

/**
 * Renders nothing — bootstraps the design studio feature by
 * registering event listeners.
 */
export const DesignsFeature: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    // Track the current main content view so we can provide
    // back navigation when the design studio is opened without
    // an explicit back event.
    let currentView: OpenMainContentViewEventData | null = null;

    Events.addListener<OpenMainContentViewEventData>(
      OpenMainContentViewEvent,
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
          eventData.backEvent = OpenMainContentViewEvent;
          eventData.backEventData = currentView;
        }

        Events.dispatch<
          OpenMainContentViewEventData<OpenDesignStudioEventData>
        >(OpenMainContentViewEvent, {
          view: DesignStudioViewName,
          props: eventData,
          title: t('designStudio.title'),
          icon: DESIGN_STUDIO_ICON,
        });
      },
    );

    return () => {
      Events.removeListener(OpenDesignStudioEvent, DesignStudioEventListenerId);
      Events.removeListener(
        OpenMainContentViewEvent,
        `${DesignStudioEventListenerId}:view-tracker`,
      );
    };
  }, [t]);

  return null;
};
