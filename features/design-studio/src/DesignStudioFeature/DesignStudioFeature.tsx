import { useEffect } from 'react';
import { Events, OpenMainContentView } from '@minddrop/events';
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
      ({ data: { databaseId } }) => {
        Events.dispatch(OpenMainContentView, {
          component: DesignStudio,
          props: { databaseId },
        });
      },
    );

    return () => {
      Events.removeListener(OpenDesignStudioEvent, EventListenerId);
    };
  }, []);

  return null;
};
