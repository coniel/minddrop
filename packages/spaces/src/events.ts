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
