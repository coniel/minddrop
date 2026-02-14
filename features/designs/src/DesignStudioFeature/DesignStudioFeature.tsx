import { useEffect } from 'react';
import { Events, OpenMainContentViewEvent } from '@minddrop/events';
import { DesignStudio } from '../DesignStudio';
import {
  EventListenerId,
  OpenDesignStudioEvent,
  OpenDesignStudioEventData,
} from '../events';

export const DesignStudioFeature: React.FC = () => {
  useEffect(() => {
    Events.addListener<OpenDesignStudioEventData>(
      OpenDesignStudioEvent,
      EventListenerId,
      ({ data }) => {
        Events.dispatch(OpenMainContentViewEvent, {
          component: DesignStudio,
          props: data,
        });
      },
    );

    return () => {
      Events.removeListener(OpenDesignStudioEvent, EventListenerId);
    };
  }, []);

  return null;
};
