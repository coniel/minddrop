import { useEffect } from 'react';
import {
  Events,
  OpenMainContentViewEvent,
  OpenMainContentViewEventData,
} from '@minddrop/events';
import { DesignStudio } from './DesignStudio';
import {
  EventListenerId,
  OpenDatabaseDesignStudioEvent,
  OpenDatabaseDesignStudioEventData,
  OpenDesignStudioEventData,
} from './events';

export const DesignStudioFeature: React.FC = () => {
  useEffect(() => {
    // Listen for database studio open events and open the database
    // design studio when one is received.
    Events.addListener<OpenDatabaseDesignStudioEventData>(
      OpenDatabaseDesignStudioEvent,
      EventListenerId,
      ({ data }) => {
        Events.dispatch<
          OpenMainContentViewEventData<OpenDesignStudioEventData>
        >(OpenMainContentViewEvent, {
          component: DesignStudio,
          props: {
            ...data,
            variant: 'database',
          },
        });
      },
    );

    return () => {
      Events.removeListener(OpenDatabaseDesignStudioEvent, EventListenerId);
    };
  }, []);

  return null;
};
