import { useEffect } from 'react';
import { Events, OpenMainContentViewEvent } from '@minddrop/events';
import { ItemTypeView } from '../ItemTypeView';
import { NewItemTypeDialog } from '../NewItemTypeDialog';
import { EventListenerId, OpenItemTypeViewEvent } from '../events';

export const ItemTypeFeature: React.FC = () => {
  useEffect(() => {
    // Listen for item type view open events
    Events.addListener<{ type: string }>(
      OpenItemTypeViewEvent,
      EventListenerId,
      ({ data }) => {
        // Open the item type view in the main content area
        Events.dispatch(OpenMainContentViewEvent, {
          component: ItemTypeView,
          props: data,
        });
      },
    );

    return () => {
      Events.removeListener(OpenItemTypeViewEvent, EventListenerId);
    };
  }, []);

  return (
    <>
      <NewItemTypeDialog />
    </>
  );
};
