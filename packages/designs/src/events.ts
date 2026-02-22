import { Design } from './types';

export const DesignCreatedEvent = 'designs:design:created';
export const DesignDeletedEvent = 'designs:design:deleted';
export const DesignUpdatedEvent = 'designs:design:updated';

export type DesignCreatedEventData = Design;
export type DesignDeletedEventData = Design;
export type DesignUpdatedEventData = {
  original: Design;
  updated: Design;
};
