import { useEffect } from 'react';
import {
  Events,
  OpenMainContentView,
  OpenMainContentViewData,
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
      ({ data: { name } }) => {
        Events.dispatch<OpenMainContentViewData<DatabaseViewProps>>(
          OpenMainContentView,
          {
            component: DatabaseView,
            props: { name },
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
