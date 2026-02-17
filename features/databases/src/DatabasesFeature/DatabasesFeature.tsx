import { useEffect } from 'react';
import {
  Events,
  OpenMainContentViewEvent,
  OpenMainContentViewEventData,
} from '@minddrop/events';
import { DatabaseView, DatabaseViewProps } from '../DatabaseView';
import { NewDatabaseDialog } from '../NewDatabaseDialog';
import {
  EventListenerId,
  OpenDatabaseViewEvent,
  OpenDatabaseViewEventData,
} from '../events';

export const DatabasesFeature: React.FC = () => {
  useEffect(() => {
    // Listen for open database view events, and open the database view when one is received
    Events.addListener<OpenDatabaseViewEventData>(
      OpenDatabaseViewEvent,
      EventListenerId,
      ({ data }) => {
        Events.dispatch<OpenMainContentViewEventData<DatabaseViewProps>>(
          OpenMainContentViewEvent,
          {
            component: DatabaseView,
            props: data,
          },
        );
      },
    );

    return () => {
      Events.removeListener(OpenDatabaseViewEvent, EventListenerId);
    };
  }, []);

  return <NewDatabaseDialog />;
};
