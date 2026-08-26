import { Space } from './types';

export const SpaceCreatedEvent = 'spaces:space:created';
export const SpaceUpdatedEvent = 'spaces:space:updated';
export const SpaceDeletedEvent = 'spaces:space:deleted';
export const SpacesLoadedEvent = 'spaces:loaded';

export type SpaceCreatedEventData = Space;

export type SpaceUpdatedEventData = {
  original: Space;
  updated: Space;
};

export type SpaceDeletedEventData = Space;

export type SpacesLoadedEventData = Space[];

declare module '@minddrop/events/EventDataMap' {
  interface EventDataMap {
    'spaces:space:created': SpaceCreatedEventData;
    'spaces:space:updated': SpaceUpdatedEventData;
    'spaces:space:deleted': SpaceDeletedEventData;
    'spaces:loaded': SpacesLoadedEventData;
  }
}
