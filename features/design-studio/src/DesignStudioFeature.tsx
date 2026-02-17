import { useEffect } from 'react';
import {
  Events,
  OpenMainContentViewEvent,
  OpenMainContentViewEventData,
} from '@minddrop/events';
import { DesignStudio } from './components/DesignStudio';
import {
  EventListenerId,
  OpenDatabaseDesignStudioEvent,
  OpenDesignStudioEventData,
} from './events';

export const DesignStudioFeature: React.FC = () => {
  useEffect(() => {
    // Listen for database studio open events and open the database
    // design studio when one is received.
    Events.addListener<OpenDesignStudioEventData>(
      OpenDatabaseDesignStudioEvent,
      EventListenerId,
      ({ data }) => {
        Events.dispatch<
          OpenMainContentViewEventData<OpenDesignStudioEventData>
        >(OpenMainContentViewEvent, {
          component: DesignStudio,
          props: data,
        });
      },
    );

    return () => {
      Events.removeListener(OpenDatabaseDesignStudioEvent, EventListenerId);
    };
  }, []);

  return null;
};
