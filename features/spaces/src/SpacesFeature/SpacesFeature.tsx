import { useEffect } from 'react';
import {
  CloseViewEvent,
  CloseViewEventData,
  Events,
  OpenViewEvent,
  OpenViewEventData,
  UpdateViewEvent,
  UpdateViewEventData,
  ViewDescriptor,
} from '@minddrop/events';
import { Tabs } from '@minddrop/feature-views';
import {
  SpaceDeletedEvent,
  SpaceDeletedEventData,
  SpaceUpdatedEvent,
  SpaceUpdatedEventData,
  Spaces,
} from '@minddrop/spaces';
import { NewSpaceDialog } from '../NewSpaceDialog';
import { SpaceViewProps } from '../SpaceView';
import { SpaceViewStateStore } from '../SpaceViewStateStore';
import {
  EventListenerId,
  OpenSpaceViewEvent,
  OpenSpaceViewEventData,
  OpenSpacesViewEvent,
  SpaceViewName,
  SpacesViewName,
} from '../events';

// Unique view instance id used to match space views in tabs
const spaceViewId = (spaceId: string) => `spaces:space:${spaceId}`;

// View instance id of the singleton spaces list view
const spacesViewId = 'spaces:spaces';

// Descriptor of the spaces list view, used both to open it and as
// the breadcrumb parent of space views. It carries no title or icon,
// which resolve from the view's registration.
const spacesViewDescriptor = (): ViewDescriptor => ({
  view: SpacesViewName,
  id: spacesViewId,
});

/**
 * Renders the spaces feature dialogs and registers event listeners
 * for opening, updating, and closing space views.
 */
export const SpacesFeature: React.FC = () => {
  useEffect(() => {
    // Close restored space views whose space no longer exists
    // (e.g. deleted externally while the app was closed)
    Tabs.getOpenTabs(SpaceViewName).forEach((tabView) => {
      const props = tabView.props as SpaceViewProps | undefined;

      // Skip views without a space ID
      if (!props?.spaceId) {
        return;
      }

      // Skip views whose space resolves
      if (Spaces.get(props.spaceId, false)) {
        return;
      }

      // Close the view
      Events.dispatch<CloseViewEventData>(CloseViewEvent, {
        id: tabView.id ?? spaceViewId(props.spaceId),
      });
    });

    // Listen for open space view events, and open the space view
    // when one is received
    Events.addListener<OpenSpaceViewEventData>(
      OpenSpaceViewEvent,
      EventListenerId,
      ({ data }) => {
        const space = Spaces.get(data.spaceId, false);

        Events.dispatch<OpenViewEventData<SpaceViewProps>>(OpenViewEvent, {
          view: SpaceViewName,
          id: spaceViewId(data.spaceId),
          props: { spaceId: data.spaceId },
          title: space?.name,
          icon: space?.icon,
          breadcrumbs: [spacesViewDescriptor()],
        });
      },
    );

    // Listen for open spaces view events, and open the spaces
    // list view when one is received
    Events.addListener(OpenSpacesViewEvent, EventListenerId, () => {
      Events.dispatch<OpenViewEventData>(OpenViewEvent, spacesViewDescriptor());
    });

    // Update the space's open view when the space changes
    // (e.g. renamed or re-iconed)
    Events.addListener<SpaceUpdatedEventData>(
      SpaceUpdatedEvent,
      EventListenerId,
      ({ data }) => {
        Events.dispatch<UpdateViewEventData>(UpdateViewEvent, {
          id: spaceViewId(data.updated.id),
          title: data.updated.name,
          icon: data.updated.icon,
        });
      },
    );

    // Close the space's open view and drop its view state when
    // the space is deleted
    Events.addListener<SpaceDeletedEventData>(
      SpaceDeletedEvent,
      EventListenerId,
      ({ data }) => {
        SpaceViewStateStore.remove(data.id);

        Events.dispatch<CloseViewEventData>(CloseViewEvent, {
          id: spaceViewId(data.id),
        });
      },
    );

    return () => {
      Events.removeListener(OpenSpaceViewEvent, EventListenerId);
      Events.removeListener(OpenSpacesViewEvent, EventListenerId);
      Events.removeListener(SpaceUpdatedEvent, EventListenerId);
      Events.removeListener(SpaceDeletedEvent, EventListenerId);
    };
  }, []);

  return <NewSpaceDialog />;
};
